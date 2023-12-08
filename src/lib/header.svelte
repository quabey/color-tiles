<script>
	import { Button, Modal, Label, Input, Checkbox } from "flowbite-svelte";
    import Auth from "./Auth.svelte";
    import LeaderBoard from "./leaderboard.svelte";
 	let authModal = false;
    let leaderboardModal = false;

	let isAuthed = false;
</script>

<nav
	class="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 mb-10"
>
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
				{#if isAuthed === false}
					<li>
						<Button
							on:click={() => (authModal = true)}
							class=""
							aria-current="page">Login</Button
						>
					</li>
				{:else}
					<li>
						<Button
							class=""
							aria-current="page">Logout</Button
						>
					</li>
				{/if}
				<li>
					<Button
                    on:click={() => (leaderboardModal = true)}
						class=""
						aria-current="page"
						>Leaderboard
					</Button>
				</li>
				<li>
                    <!-- TODO: Only show if the game isnt paused and reset grid on grid -->
					<Button
						class=""
						aria-current="page"
						>Restart
					</Button>
				</li>
				<li>
					<Button
						class=""
						aria-current="page"
						>Solve
					</Button>
				</li>
			</ul>
		</div>
	</div>
</nav>

<Modal bind:open={authModal} size="xs" autoclose={false} class="w-full">
	<Auth/>
</Modal>
<Modal bind:open={leaderboardModal} size="lg" autoclose={false} class="w-full">
	<LeaderBoard/>
</Modal>
