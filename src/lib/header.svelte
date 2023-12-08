<script>
	import {
		Button,
		Modal,
		Dropdown,
		DropdownItem,
		Avatar,
        Label
	} from "flowbite-svelte";

	import Auth from "./Auth.svelte";
	import LeaderBoard from "./leaderboard.svelte";
	import { supabase } from "./supabase";
	let authModal = false;
	let leaderboardModal = false;
	let user;
	supabase.auth.onAuthStateChange((event, session) => {
		if (event === "INITIAL_SESSION") {
			console.log("Welcome to Colour-Tile!");
			console.log("Auth Status:", session.user);
			// TODO: New user onboarding walk through?

			// TODO: New user check using session.user
		} else {
			user = null;
		}
		if (event === "SIGNED_IN") {
			user = session.user;
			console.log("You are now Authed - Auth Status:", user.id);
		} else {
			user = null;
		}
		if (event === "SIGNED_OUT") {
			let user = null;
			console.log("You are now logged out - Auth Status:", user);
		}
	});
</script>

<nav class="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
	<div
		class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
	>
		<Button class="flex items-center space-x-3 rtl:space-x-reverse">
			<span
				class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
				>Colour-Tile</span
			>
		</Button>

		<div class="hidden w-full md:block md:w-auto" id="navbar-dropdown">
			<ul
				class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
			>
				<Button pill color="light" id="avatar_menu" class="!p-1">
					<Avatar
						src={user?.user_metadata.picture ?? ""}
						class="me-2"
					/>
                    <Label defaultClass="text-lg" >
					{user?.user_metadata.full_name ?? "👋"}
                </Label>
				</Button>

				<Dropdown triggeredBy="#avatar_menu">
					<div slot="header" class="px-4 py-2">
						{#if user == null}
							<span
								class="block text-sm text-gray-900 dark:text-white"
								>{user?.user_metadata.full_name ?? ""}</span
							>
							<span class="block truncate text-sm font-medium"
								>{user?.user_metadata.email ?? ""}</span
							>
						{/if}
					</div>
					<DropdownItem on:click={() => (leaderboardModal = true)}
						>Leaderboard</DropdownItem
					>
					<DropdownItem>Solve</DropdownItem>
					<DropdownItem>Restart</DropdownItem>
					{#if user == null}
						<DropdownItem
							slot="footer"
							on:click={() => (authModal = true)}
							>Login</DropdownItem
						>
					{:else}
						<DropdownItem
							slot="footer"
							on:click={() => {
								supabase.auth.signOut();
							}}>Sign out</DropdownItem
						>
					{/if}
				</Dropdown>

				<!-- {/if} -->
			</ul>
		</div>
	</div>
</nav>

<Modal bind:open={authModal} size="xs" autoclose={false} class="w-full">
	<Auth />
</Modal>
<Modal bind:open={leaderboardModal} size="lg" autoclose={false} class="w-full">
	<LeaderBoard />
</Modal>
