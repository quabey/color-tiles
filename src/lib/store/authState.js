import { get, writable } from "svelte/store";

export const authState = writable({
    user: null,
    session: null,
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