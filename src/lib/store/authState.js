import { get, writable } from "svelte/store";

export const authState = writable({
	user: null,
	session: null,
	stats: {
		timed_highscore: 0,
		timed_highestCombo: 0,
		timed_gamesPlayed: 0,
		timed_gamesCompleted: 0,
		timed_completionTime: 0,
	},
});

export const username = writable("");
export const profileImg = writable("");
export const email = writable("");
export const userID = writable("");

export const loggedIn = writable(false);

// ====================== HELPER FUNCTIONS ====================== //

export const getProfileImg = () => {
    if (get(authState).user != null) {
        return get(authState).user.user_metadata.picture;
    } else {
        return "";
    }
}