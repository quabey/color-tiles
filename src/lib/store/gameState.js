import { writable, get } from "svelte/store";

const GameState = writable({
	grid: [],
	score: 0,
	gameOver: false,
	gameWon: false,
	numberOfMoves: 0,
	metadata: {
		found: false,
		timer: 0,
	},
});
// Initialize the colours
export const colors = [
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

export function initGameState() {
	// Total number of tiles
	const totalTiles = 23 * 15;

	// Number of colored tiles (approximately 21 of each color)
	const coloredTiles = 10 * 21;

	let gameState = get(GameState);
	// Set the grid to initial state
	gameState.grid = Array(totalTiles).fill(null);
	for (let color of colors) {
		let count = 0;
		while (count < 21) {
			let index = Math.floor(Math.random() * totalTiles);
			if (gameState.grid[index] === null) {
				gameState.grid[index] = color;
				count++;
			}
		}
	}
	// Randomly distribute empty spaces, ensuring some grouping
	let emptyTilesNeeded = totalTiles - coloredTiles;
	while (emptyTilesNeeded > 0) {
		let index = Math.floor(Math.random() * totalTiles);
		if (gameState.grid[index] !== null) {
			continue;
		}

		let groupSize = Math.min(
			Math.floor(Math.random() * 3) + 1,
			emptyTilesNeeded,
		);
		for (let i = 0; i < groupSize && index + i < totalTiles; i++) {
			if (gameState.grid[index + i] === null) {
				gameState.grid[index + i] = "transparent";
				emptyTilesNeeded--;
			}
		}
	}

	gameState.grid = chunkArray(gameState.grid, 23);
	// console.log("Game State:", gameState)
	GameState.update((state) => {
		state.grid = gameState.grid;
		return state;
	});

	// console.log("Game State:", getGrid())

	return GameState;
}

function chunkArray(array, size) {
	return Array.from({ length: Math.ceil(array.length / size) }, (v, i) =>
		array.slice(i * size, i * size + size),
	);
}

// HLEPER FUNCTIONS
export const getGrid = () => get(GameState).grid;
export const getScore = () => get(GameState).score;
export const getGameOver = () => get(GameState).gameOver;
export const getGameWon = () => get(GameState).gameWon;
export const getNumberOfMoves = () => get(GameState).numberOfMoves;
export const getMetadata = () => get(GameState).metadata;

function playSound(sound) {
	switch (sound) {
		case "success":
			let successSound = new Audio(
				"https://cdn.freesound.org/previews/702/702806_6142149-lq.mp3",
			);
			successSound.play();
			break;
		default:
			break;
	}
}

// GAME LOGIC
export function handleTileClick(row, col) {
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
	let gameState = get(GameState);
	if (gameState.metadata.found) {
		playSound("success");

		// gameState.metadata.found = false;
		GameState.update((state) => {
			state.metadata.found = false;
			return state;
		});
		checkWin();
	}
}

function checkAndClear(color1, color2) {
	let gameState = get(GameState);
	if (color1 == false || color2 == undefined) {
		return false;
	}
	if (color1.color === color2.color) {
		console.log(`${color1.color} and ${color2.color} match`);
		gameState.grid[color1.row][color1.col] = "transparent";
		gameState.grid[color2.row][color2.col] = "transparent";

		// The game score is increased by 10 points for each pair of tiles removed.
		GameState.update((state) => {
			state.grid = gameState.grid;
			state.score += 10;
			state.numberOfMoves += 1;
			state.metadata.found = true;
			return state;
		});

		return true;
	}
	return false;
}

function getColorAt(row, col) {
	let gameState = get(GameState);
	if (
		row < 0 ||
		row >= gameState.grid.length ||
		col < 0 ||
		col >= gameState.grid[row].length
	) {
		console.error("Invalid coordinates");
		return null;
	}
	return gameState.grid[row][col];
}

function checkWin() {
	let gameState = get(GameState);
	removeSingles();
	for (let row of gameState.grid) {
		for (let cell of row) {
			if (cell !== "transparent") {
				return false;
			}
		}
	}
	return true;
}

function removeSingles() {
	let gameState = get(GameState);
	let colorCounts = {};
	for (let row of gameState.grid) {
		for (let cell of row) {
			if (cell !== "transparent") {
				if (colorCounts[cell]) {
					colorCounts[cell]++;
				} else {
					colorCounts[cell] = 1;
				}
			}
		}
	}
	for (let color in colorCounts) {
		let gameState = get(GameState);
		if (colorCounts[color] === 1) {
			for (let row of gameState.grid) {
				for (let cell of row) {
					if (cell === color) {
						cell = "transparent";
					}
				}
			}
		}
	}
}

function checkColor(row, col, direction) {
	switch (direction) {
		case "up":
			let upColor = getColorAt(row - 1, col);
			if (upColor != null && upColor != "transparent") {
				return { row: row - 1, col: col, color: upColor };
			} else if (upColor == null) {
				return false;
			} else {
				return checkColor(row - 1, col, direction);
			}
		case "down":
			let downColor = getColorAt(row + 1, col);
			if (downColor != null && downColor != "transparent") {
				return { row: row + 1, col: col, color: downColor };
			} else if (downColor == null) {
				return false;
			} else {
				return checkColor(row + 1, col, direction);
			}
		case "left":
			let leftColor = getColorAt(row, col - 1);
			if (leftColor != null && leftColor != "transparent") {
				return { row: row, col: col - 1, color: leftColor };
			} else if (leftColor == null) {
				return false;
			} else {
				return checkColor(row, col - 1, direction);
			}
		case "right":
			let rightColor = getColorAt(row, col + 1);
			if (rightColor != null && rightColor != "transparent") {
				return { row: row, col: col + 1, color: rightColor };
			} else if (rightColor == null) {
				return false;
			} else {
				return checkColor(row, col + 1, direction);
			}
		default:
			return false;
	}
}
