import { createClient } from "@supabase/supabase-js";
import { authState, loggedIn, profileImg, getProfileImg, username, email, userID } from "./store/authState";
import { get } from "svelte/store";
import toast from 'svelte-french-toast';

export const supabase = createClient(
	"https://xtluwutnmmpqayjulquy.supabase.co",
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bHV3dXRubW1wcWF5anVscXV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDAyMzYyMjksImV4cCI6MjAxNTgxMjIyOX0.WHlXgWQaZMRdD2OD8S9APrSofaBtGOax9865ciFJR28",
);

export const getLeaderboard = async () => {
	const { data, error } = await supabase.from("color_profiles").select("username, timed_highscore, timed_completionTime, timed_gamesPlayed, timed_gamesCompleted");
	if (error) {
		console.log(error);
		return [];
	}
	return data;
}

export const getStats = async () => {
	const { data, error } = await supabase
		.from("color_profiles")
		.select(
			"timed_highscore, timed_completionTime, timed_gamesPlayed, timed_gamesCompleted",
		)
		.eq("user_id", get(authState).user.user_metadata.full_name);
	if (error) {
		console.log(error);
		return [];
	}
	return data;
}

const getProfile = async () => {
	const { data, error } = await supabase
		.from("color_profiles")
		.select("timed_highscore, timed_completionTime, timed_gamesPlayed, timed_gamesCompleted, timed_highestCombo")
		.eq("user_id", get(userID))
		.single();
	if (error) {
		console.log(error);
		return [];
	}
	return data;
}

export const onLogin = async () => {
	toast.success("Logged in");
	loggedIn.set(true);
	const { data, error } = await supabase.auth.getUser();
	userID.set(data.user.id);
	const profile = await getProfile();
	authState.set({ 
		user: data.user, 
		session: await supabase.auth.getSession(), 
		stats: { 
			timed_highscore: profile.timed_highscore, 
			timed_highestCombo: profile.timed_highestCombo, 
			timed_gamesPlayed: profile.timed_gamesPlayed, 
			timed_gamesCompleted: profile.timed_gamesCompleted, 
			timed_completionTime: profile.timed_completionTime 
		} 
	});
	profileImg.set(getProfileImg());
	username.set(get(authState).user.user_metadata.full_name);
	email.set(get(authState).user.email);
	console.log(get(authState));
}

export const onLoggout = async () => {
	toast.success("Logged out");
	loggedIn.set(false);
	authState.set({ user: null, session: null, stats: null });
	profileImg.set("");
	username.set("");
	email.set("");
	userID.set("");
}

export const onGameEnd = async (score, time, combo, finished) => {
	if (!get(loggedIn)) return;
	let returnObj = {};
	if (score > get(authState).stats.timed_highscore) {
		returnObj.timed_highscore = score;
	}
	if (time < get(authState).stats.timed_completionTime) {
		returnObj.timed_completionTime = time;
	}
	if (combo > get(authState).stats.timed_highestCombo) {
		returnObj.timed_highestCombo = combo;
	}
	if (finished) {
		returnObj.timed_gamesCompleted = get(authState).stats.timed_gamesCompleted + 1;
	}
	returnObj.timed_gamesPlayed = get(authState).stats.timed_gamesPlayed + 1;
	console.log(returnObj);
	try {
		const { data, error } = await supabase
			.from("color_profiles")
			.update(returnObj)
			.eq("user_id", get(userID))
			.throwOnError();
	} catch (error) {
		console.error(error);
	}
	
	console.log(get(authState));
}