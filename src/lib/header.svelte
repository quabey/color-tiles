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
	import Settings from "./settings.svelte";
	import { supabase } from "./supabase";
	import { username, profileImg, email, authState } from "./store/authState";
    import { resetGameState, getGameState, isPaused, endGame } from "./store/gameState";
	import { leaderBoardModal } from "./store/leaderBoardState";
	import { settingsModal } from "./store/settingsState";
	import Leaderboard from "./leaderboard.svelte";

	let authModal = false;
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
                disabled={$isPaused || $leaderBoardModal || $settingsModal}>
                    <Label class="text-white">End Game</Label>
                </Button>
            </div>
        </div>

		<div class="hidden w-full md:block md:w-auto" id="navbar-dropdown">
			<ul
				class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
			>
				<Button pill color="light" id="avatar_menu" class="!p-1 transition hover:scale-125 z-[100]">
					<Avatar
						src={$profileImg}
						class="me-2"
					/>
                    <Label defaultClass="text-lg hover:cursor-pointer" >
					{$username != "" ? $username : "Log in 👋"}
                </Label>
				</Button>

				<Dropdown triggeredBy="#avatar_menu" containerClass='z-[100]'>
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
					<DropdownItem on:click={() => {
						$leaderBoardModal = true;
						$settingsModal = false;
						$isPaused = false;
					}}
						>Leader board</DropdownItem
					>
					<DropdownItem class="z-[1000]">Solve</DropdownItem>
					<DropdownItem on:click={resetGameState} class="z-[1000]">Restart</DropdownItem>
					<DropdownItem on:click={() => {
						$settingsModal = true;
						$leaderBoardModal = false;
						$isPaused = false;
					}} 
						>Settings</DropdownItem>
					{#if $authState.user == null}
						<DropdownItem
							slot="footer"
							on:click={() => (authModal = true)}
							class="z-[1000]">Login</DropdownItem
						>
					{:else}
						<DropdownItem
							slot="footer"
							on:click={() => {
								supabase.auth.signOut();
							}} class="z-[1000]">Sign out</DropdownItem
						>
					{/if}
				</Dropdown>
			</ul>
		</div>
	</div>
</nav>

<Modal bind:open={authModal} size="xs" autoclose={false} class="w-full" classBackdrop="z-[100]" classDialog="z-[100]">
	<Auth />
</Modal>
<Modal title="Leaderboard" bind:open={$leaderBoardModal} size="lg" autoclose={false} class="w-full" on:close={() => {
	$leaderBoardModal = false;
	if (!$settingsModal) {
		$isPaused = true;
	}
}}>
	<LeaderBoard />
</Modal>
<Modal title="Settings" bind:open={$settingsModal} size="lg" autoclose={false} class="w-full" on:close={() => {
	$settingsModal = false;
	if (!$leaderBoardModal) {
		$isPaused = true;
	}
}}>
	<Settings />
</Modal>
