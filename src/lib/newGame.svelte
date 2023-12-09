<script>
    import { Button, Modal, Label, Input, Checkbox } from "flowbite-svelte";
    import { authState, loggedIn } from "./store/authState.js";
    import { getScore, getGameOver, getGameWon, getNumberOfMoves, isPaused } from "./store/gameState.js";
</script>

<div class="flex flex-col items-center justify-center text-center space-y-4">
    <h1 class="font-bold text-3xl text-gray-800">Color Tiles</h1>
    {#if $loggedIn}
        <div class="space-y-2">
            <h2 class="text-2xl font-semibold text-blue-600">High Score: {$authState.stats.timed_highscore}</h2>
            <h2 class="text-2xl font-semibold text-green-600">Highest Combo: {$authState.stats.timed_highestCombo}</h2>
            <h2 class="text-2xl font-semibold text-purple-600">Games Played: {$authState.stats.timed_gamesPlayed}</h2>
            <h2 class="text-2xl font-semibold text-red-600">Games Won: {$authState.stats.timed_gamesCompleted}</h2>
            <h2 class="text-2xl font-semibold text-yellow-600">Fastest Completion: {$authState.stats.timed_completionTime}</h2>
        </div>
    {:else}
        <div class="text-xl font-semibold text-gray-500">
            Log in to see your stats!
        </div>
    {/if}
    <Button class="px-6 py-2 text-white font-bold rounded-lg transition-colors" on:click={() => ($isPaused = false)}>
        <span class="text-2xl">Play!</span>
    </Button>
</div>
