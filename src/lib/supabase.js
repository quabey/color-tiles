import { createClient } from "@supabase/supabase-js";

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