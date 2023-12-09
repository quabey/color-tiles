<script>
	import { Button, Modal, Label, Input, Checkbox } from "flowbite-svelte";
	import { supabase } from "./supabase";

	let da;

	const discordSignIn = async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "discord",
		})
		console.log(data, error);
		da = data;
	};

	async function log() {
		const { data: { user } } = await supabase.auth.getUser()
		console.log(user);
	}
    log();
</script>

<div class="flex flex-col items-center space-y-4 py-6">
    <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">
        Sign in
    </h3>
    <button on:click={discordSignIn}>
        <img src="https://pughub.tf/discordbutton.png" alt="Sign in with Discord">
    </button>
    <button on:click={log}>
        Log
    </button>
</div>

