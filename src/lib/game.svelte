<script>
	import { onMount } from "svelte";
	let grid = [];
	let found = false;
	const colors = [
		"red",
		"blue",
		"green",
		"yellow",
		"purple",
		"orange",
		"pink",
		"BurlyWood",
		"grey",
		"black",
	];


	function initializeGrid() {
		// Total number of tiles
		const totalTiles = 23 * 15;

		// Number of colored tiles (approximately 21 of each color)
		const coloredTiles = 10 * 21;

		// Initialize grid with null values
		grid = Array(totalTiles).fill(null);

		// Populate grid with colors
		for (let color of colors) {
			let count = 0;
			while (count < 21) {
				let index = Math.floor(Math.random() * totalTiles);
				if (grid[index] === null) {
					grid[index] = color;
					count++;
				}
			}
		}

		// Randomly distribute empty spaces, ensuring some grouping
		let emptyTilesNeeded = totalTiles - coloredTiles;
		while (emptyTilesNeeded > 0) {
			let index = Math.floor(Math.random() * totalTiles);
			if (grid[index] !== null) {
				continue;
			}

			let groupSize = Math.min(
				Math.floor(Math.random() * 3) + 1,
				emptyTilesNeeded,
			);
			for (let i = 0; i < groupSize && index + i < totalTiles; i++) {
				if (grid[index + i] === null) {
					grid[index + i] = "transparent";
					emptyTilesNeeded--;
				}
			}
		}

		// Convert the flat array to a 2D array for easier rendering
		grid = chunkArray(grid, 23);
	}

	function chunkArray(array, size) {
		return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
			array.slice(i * size, i * size + size),
		);
	}

	initializeGrid();

	let cellSize;

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

    function playSound(sound) {
        switch (sound) {
            case "success":
                let successSound = new Audio("https://cdn.freesound.org/previews/702/702806_6142149-lq.mp3");
                successSound.play();
                break;
            default:
                break;
        }
    }

	onMount(() => {
		window.addEventListener("resize", resizeGrid);
		resizeGrid();
	});

	function handleTileClick(row, col) {
		console.log(row, col);
        let color = getColorAt(row, col);
        console.log(color);
        if (color != "transparent") {
            return;
        }
        let up = checkColor(row, col, "up");
        let down = checkColor(row, col, "down");
        let left = checkColor(row, col, "left");
        let right = checkColor(row, col, "right");
        console.log(up, down, left, right);
        checkAndClear(up, down);
        checkAndClear(left, right);
        checkAndClear(up, left);
        checkAndClear(up, right);
        checkAndClear(down, left);
        checkAndClear(down, right);
		if (found) {
			playSound("success");
			found = false;
		}
	}

    function checkAndClear(color1, color2) {
	if (color1 == false || color2 == undefined) {
		return false;
	}
    if (color1.color === color2.color) {
        console.log(`${color1.color} and ${color2.color} match`);
        grid[color1.row][color1.col] = "transparent";
        grid[color2.row][color2.col] = "transparent";
		found = true;
		return true;
    }
	return false;
}

	function getColorAt(row, col) {
		if (
			row < 0 ||
			row >= grid.length ||
			col < 0 ||
			col >= grid[row].length
		) {
			console.error("Invalid coordinates");
			return null;
		}
		return grid[row][col];
	}

    function checkColor(row, col, direction) {
        switch (direction) {
            case "up":
                let upColor = getColorAt(row - 1, col);
                if (upColor != null && upColor != "transparent") {
                    return {row: row - 1, col: col, color: upColor};
                } else if (upColor == null){
                    return false;
                } else {
                    return checkColor(row - 1, col, direction);
                }
            case "down":
                let downColor = getColorAt(row + 1, col);
                if (downColor != null && downColor != "transparent") {
                    return {row: row + 1, col: col, color: downColor};
                } else if (downColor == null){
                    return false;
                } else {
                    return checkColor(row + 1, col, direction);
                }
            case "left":
                let leftColor = getColorAt(row, col - 1);
                if (leftColor != null && leftColor != "transparent") {
                    return {row: row, col: col - 1, color: leftColor};
                } else if (leftColor == null){
                    return false;
                } else {
                    return checkColor(row, col - 1, direction);
                }
            case "right":
                let rightColor = getColorAt(row, col + 1);
                if (rightColor != null && rightColor != "transparent") {
                    return {row: row, col: col + 1, color: rightColor};
                } else if (rightColor == null){
                    return false;
                } else {
                    return checkColor(row, col + 1, direction);
                }
            default:
                return false;
        }
    }
</script>

<div
	class="gamegrid"
	style={`width: ${23 * cellSize + 22}px; height: ${15 * cellSize + 14}px;`}
>
	{#each grid as row, rowIndex}
		{#each row as cell, colIndex}
			<button
				class="cell"
				style={`width: ${cellSize}px; height: ${cellSize}px; background-color: ${
					cell || "transparent"
				};`}
				on:click={() => handleTileClick(rowIndex, colIndex)}
			>
			</button>
		{/each}
	{/each}
</div>

<style>
	.gamegrid {
		display: grid;
		grid-template-columns: repeat(23, 1fr);
		grid-row-gap: 1px;
		grid-column-gap: 1px;
		margin: auto; 
	}

	.cell {
		aspect-ratio: 1 / 1;
		box-sizing: border-box;
	}
</style>
