<script>
	import { onMount } from "svelte";
	import NewGame from "./newGame.svelte";
	import { onGameEnd, supabase } from "./supabase.js";
	import { initGameState, handleTileClick, getGrid, isPaused, endGame } from "./store/gameState";
	import { get } from "svelte/store";

	import { Button, Modal, Label, Input, Checkbox } from "flowbite-svelte";

	let cellSize = 0;
	let currentHover = { row: null, col: null };

	let gameState = initGameState();

	function resizeGrid() {
		const maxWidth = window.innerWidth;
		const maxHeight = window.innerHeight;
		const gridWidth = maxWidth * 0.9; // 90% of the viewport width
		const gridHeight = maxHeight * 0.9; // 90% of the viewport height

		// Calculate the size for one cell, accounting for the gaps (22 gaps in total)
		cellSize = Math.min(
			(gridWidth - 22 * 1) / 23, // Subtract the total horizontal gap size
			(gridHeight - 14 * 1) / 15, // Subtract the total vertical gap size
		);
	}

	onMount(() => {
		window.addEventListener("resize", resizeGrid);
		resizeGrid();
	});
</script>

<Modal bind:open={$isPaused} dismissable={false}>
	<NewGame />
</Modal>

<div class="relative z-0">
	<div
		class={$isPaused ? "gamegrid relative blur-sm p-5 pt-8" : "gamegrid relative p-5 pt-8"}
		style={`width: ${23 * cellSize + 22}px; height: ${
			15 * cellSize + 14
		}px;`}
	>
		{#each $gameState.grid as row, rowIndex}
			{#each row as cell, colIndex}
				<div class:highlighted={colIndex == currentHover.col || rowIndex == currentHover.row}>
					<button
					disabled={$isPaused}
					class="cell rounded-lg drop-shadow-xl mx-[3px]"
					style={`width: ${cellSize}px; height: ${cellSize}px; background-color: ${
						cell || "transparent"
					};`}
					on:click={() => handleTileClick(rowIndex, colIndex)}
					on:mouseenter={() => {
						currentHover = { row: rowIndex, col: colIndex };
					}}
				>
				</button>
				</div>
			{/each}
		{/each}
	</div>
</div>

<div class="absolute left-0 top-0 font-bold ml-2">
		<br>
		Score: {$gameState.score}
		<br>
		Number of moves: {$gameState.numberOfMoves}
		<br>
		Combo: {$gameState.comboMultiplier}x
		<br>
		<button on:click={() => endGame()}>end </button>
</div>
<style>
	.gamegrid {
		display: grid;
		grid-template-columns: repeat(23, 1fr);;
		margin: auto;
	}

	.cell {
		aspect-ratio: 1 / 1;
		box-sizing: border-box;
	}

	.highlighted {
		background-color: rgb(209, 203, 203);
	}
</style>
