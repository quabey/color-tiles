<script>
	import { Button, Modal, Label, Input, Checkbox } from "flowbite-svelte";
	import { supabase } from "./supabase";

	let da;

	const discordSignIn = async () => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: "discord",
		});
		console.log(data, error);
		da = data;
	};

	async function log() {
		const { data: { user } } = await supabase.auth.getUser()
		console.log(user);
	}
</script>

<div class="flex flex-col space-y-6" >
	<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
		Sign in
	</h3>
	<button on:click={discordSignIn}>
		<img src="https://pughub.tf/discordbutton.png" alt="">
	</button>
	<button on:click={log}>log</button>
</div>
