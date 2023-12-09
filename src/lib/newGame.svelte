<script>
    import { Button, Modal, Label, Input, Checkbox } from "flowbite-svelte";
    import { authState, loggedIn } from "./store/authState.js";
    import { getScore, getGameOver, getGameWon, getNumberOfMoves, isPaused } from "./store/gameState.js";
</script>

<div class="flex align-center flex-col">
    <h1 class="font-bold text-xl">Color Tiles</h1>
    {#if $loggedIn}
        <div class="text-xl font-bold">
        <h1>Highscore: {$authState.stats.timed_highscore}</h1>
        <h1>Highest Combo: {$authState.stats.timed_highestCombo}</h1>
        <h1>Games Played: {$authState.stats.timed_gamesPlayed}</h1>
        <h1>Games Won: {$authState.stats.timed_gamesCompleted}</h1>
        <h1>Fastest Completion: {$authState.stats.timed_completionTime}</h1>

    </div>
    {:else}
        <div class="text-xl font-bold">
            Login to see your stats!
        </div>
    {/if}
    <Button class="" on:click={() => ($isPaused = false)}>
			<span
				class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
				>Play!</span
			>
		</Button>
</div>