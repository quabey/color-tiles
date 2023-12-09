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
	import { username, profileImg, email, authState } from "./store/authState";
    import { resetGameState, getGameState, isPaused, endGame } from "./store/gameState";

	let authModal = false;
	let leaderboardModal = false;
    const gameState = getGameState();

</script>

<nav class=" border-gray-200 dark:bg-gray-900 dark:border-gray-700">
	<div
		class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
	>
		<Label class="flex items-center space-x-3 rtl:space-x-reverse">
			<span
				class="self-center text-4xl font-semibold whitespace-nowrap dark:text-white"
				>Color Tiles</span
			>
		</Label>

        <div class="">
            <div class="flex flex-col space-y-2 px-4 justify-center items-center">
                <h3 class="text-lg mb-0">Game Mode: {$gameState.gameMode}</h3>
                <div class="grid grid-cols-3 gap-x-12 place-items-center">
                    <div class="grid justify-items-center">
                        <h4 class="font-bold w-full">Score</h4>
                        <p class="text-xl">{$gameState.score}</p>

                    </div>
                    <div class="grid justify-items-center">
                        <h4 class="font-bold w-full">Turns</h4>
                        <p class="text-xl">{$gameState.numberOfMoves}</p>
                    </div>
                    <div class="grid justify-items-center">
                        <h4 class="font-bold w-full">Combo</h4>
                        <p class="text-xl">{$gameState.comboMultiplier}x</p>
                    </div>
                </div>
                <Button class="w-full p-1" color="red" on:click={() => {
                    endGame()
                }}
                disabled={$isPaused}>
                    <Label class="text-white">End Game</Label>
                </Button>
            </div>
        </div>

		<div class="hidden w-full md:block md:w-auto" id="navbar-dropdown">
			<ul
				class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
			>
				<Button pill color="light" id="avatar_menu" class="!p-1">
					<Avatar
						src={$profileImg}
						class="me-2"
					/>
                    <Label defaultClass="text-lg" >
					{$username != "" ? $username : "Login 👋"}
                </Label>
				</Button>

				<Dropdown triggeredBy="#avatar_menu">
					<div slot="header" class="px-4 py-2">
						{#if $authState.user != null}
							<span
								class="block text-sm text-gray-900 dark:text-white"
								>{$username != "" ? $username : ""}</span
							>
							<span class="block truncate text-sm font-medium"
								>{$email}</span
							>
						{/if}
					</div>
					<DropdownItem on:click={() => (leaderboardModal = true)}
						>Leaderboard</DropdownItem
					>
					<DropdownItem>Solve</DropdownItem>
					<DropdownItem
                        on:click={() => {
                           resetGameState()
                        }}
                    >Restart</DropdownItem>
					{#if $authState.user == null}
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
