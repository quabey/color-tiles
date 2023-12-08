<script>
    import { Button, Modal, Label, Input, Checkbox } from "flowbite-svelte";
    import { getScore, getGameOver, getGameWon, getNumberOfMoves, isPaused } from "./store/gameState.js";
</script>

<div class="flex align-center flex-col">
    <div class="text-xl font-bold">
        <h1>Highscore: </h1>
        <h1>Highest Combo: </h1>
        <h1>Games Played:</h1>
        <h1>Games Won:</h1>

    </div>
    <Button class="" on:click={() => ($isPaused = false)}>
			<span
				class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
				>Play!</span
			>
		</Button>
</div>