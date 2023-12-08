<script>
	import Game from "./lib/game.svelte";
	import Header from "./lib/header.svelte";
	import { supabase } from "./lib/supabase.js";
	import { onMount } from "svelte";
	import { authState, loggedIn } from "./lib/store/authState";
	import { onLogin, onLoggout } from "./lib/supabase.js";

	onMount(() => {
		supabase.auth.onAuthStateChange((event, session) => {
			if (event === 'SIGNED_IN' && !$loggedIn) {
				$loggedIn = true;
				console.log('logged in');
				try {
					onLogin();
				} catch (error) {
					console.log(error);
				}
			}
			if (event === 'SIGNED_OUT') {
				$loggedIn = false;
				console.log('Logged out');
				onLoggout();
			}
		});
	});
</script>

<div class="h-screen w-screen">
	<div class="z-[1000000] relative">
		<Header/>
	</div>
	<Game />
</div>
