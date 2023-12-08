import { createClient } from "@supabase/supabase-js";
import { authState, loggedIn, profileImg, getProfileImg, username, email } from "./store/authState";
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

export const onLogin = async () => {
	toast.success("Logged in");
	loggedIn.set(true);
	const { data, error } = await supabase.auth.getUser();
	authState.set({ user: data.user, session: await supabase.auth.getSession() });
	profileImg.set(getProfileImg());
	username.set(get(authState).user.user_metadata.full_name);
	email.set(get(authState).user.email);
	console.log(get(authState));
}

export const onLoggout = async () => {
	toast.success("Logged out");
	loggedIn.set(false);
	authState.set({ user: null, session: null });
	profileImg.set("");
	username.set("");
	email.set("");
}