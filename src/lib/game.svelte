<script>
	import { onMount } from "svelte";
	import { supabase } from "./supabase.js";
	import { initGameState, handleTileClick, getGrid } from "./store/gameState";
	import { get } from "svelte/store";

	import { Button, Modal, Label, Input, Checkbox } from "flowbite-svelte";

	let isPaused = true;
	let cellSize = 0;
	
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

<div class="relative">
	{#if isPaused}
		<Button
			class="flex items-center space-x-3 rtl:space-x-reverse absolute z-10"
			style="top: 50%; left: 50%; transform: translate(-50%, -50%);"
			on:click={() => (isPaused = !isPaused)}
		>
			<span
				class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
				>Play!</span
			>
		</Button>
	{/if}

	<div
		class={isPaused ? "gamegrid relative blur-sm p-5 pt-8" : "gamegrid relative p-5 pt-8"}
		style={`width: ${23 * cellSize + 22}px; height: ${
			15 * cellSize + 14
		}px;`}
	>
		{#each $gameState.grid as row, rowIndex}
			{#each row as cell, colIndex}
				<button
					disabled={isPaused}
					class="cell rounded-lg drop-shadow-xl"
					style={`width: ${cellSize}px; height: ${cellSize}px; background-color: ${
						cell || "transparent"
					};`}
					on:click={() => handleTileClick(rowIndex, colIndex)}
				>
				</button>
			{/each}
		{/each}
	</div>
</div>

<div class="absolute left-0 top-0 font-bold">
		<span class="">
			Game State: Score: {$gameState.score}
		</span>
		<span>
			Number of moves: {$gameState.numberOfMoves}
		</span>
		<span>
			Combo: {$gameState.comboMultiplier}x
		</span> 
	</div>

<style>
	.gamegrid {
		display: grid;
		grid-template-columns: repeat(23, 1fr);
		grid-row-gap: 4px;
		grid-column-gap: 4px;
		margin: auto;
	}

	.cell {
		aspect-ratio: 1 / 1;
		box-sizing: border-box;
	}
</style>
