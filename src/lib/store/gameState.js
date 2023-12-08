import { writable, get } from "svelte/store";

const GameState = writable({
	grid: [],
	score: 0,
	comboMultiplier: 1,
	gameOver: false,
	gameWon: false,
	numberOfMoves: 0,
	metadata: {
		found: 0,
		traveledDistance: 0,
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
	let up = checkColor(row, col, "up", 0);
	let down = checkColor(row, col, "down", 0);
	let left = checkColor(row, col, "left", 0);
	let right = checkColor(row, col, "right", 0);
	console.log(up, down, left, right);
	checkAndClear(up, down);
	checkAndClear(left, right);
	checkAndClear(up, left);
	checkAndClear(up, right);
	checkAndClear(down, left);
	checkAndClear(down, right);
	let gameState = get(GameState);
	calcComboMultiplier(gameState.metadata.found);
	calcScore(gameState.metadata.traveledDistance);
	if (gameState.metadata.found >= 1) {
		playSound("success");
		console.log(gameState.metadata.found);
		// gameState.metadata.found = false;
		GameState.update((state) => {
			state.metadata.found = 0;
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

		if ((gameState.grid[color1.row][color1.col] != "transparent")) {
			gameState.grid[color1.row][color1.col] = "transparent";
			gameState.metadata.found += 1;
			gameState.metadata.traveledDistance += color1.traveled;
		}
		if ((gameState.grid[color2.row][color2.col] != "transparent")) {
			gameState.grid[color2.row][color2.col] = "transparent";
			gameState.metadata.found += 1;
			gameState.metadata.traveledDistance += color2.traveled;
		}	

		GameState.update((state) => {
			state.grid = gameState.grid;
			state.numberOfMoves += 1;
			return state;
		});

		return true;
	}
	return false;
}


function calcScore(combinedDistance) {
	let multiplier = get(GameState).comboMultiplier;
	let score = get(GameState).score;
	console.log("old score: ", score);
	console.log("multiplier: ", multiplier);
	console.log("combinedDistance: ", combinedDistance);
	GameState.update((state) => {
		state.score = score + multiplier * combinedDistance;
		state.metadata.traveledDistance = 0;
		return state;
	});
}

function calcComboMultiplier(removed) {
	let current = get(GameState).comboMultiplier;
	if (removed <= 2) {
		GameState.update((state) => {
			state.comboMultiplier = 1;
			return state;
		});
	} else {
		GameState.update((state) => {
			state.comboMultiplier = current + (removed - 2);
			return state;
		});
	}
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

function checkColor(row, col, direction, traveled) {
	traveled++;
	switch (direction) {
		case "up":
			let upColor = getColorAt(row - 1, col);
			if (upColor != null && upColor != "transparent") {
				return { row: row - 1, col: col, color: upColor, traveled };
			} else if (upColor == null) {
				return false;
			} else {
				return checkColor(row - 1, col, direction, traveled);
			}
		case "down":
			let downColor = getColorAt(row + 1, col);
			if (downColor != null && downColor != "transparent") {
				return { row: row + 1, col: col, color: downColor, traveled };
			} else if (downColor == null) {
				return false;
			} else {
				return checkColor(row + 1, col, direction, traveled);
			}
		case "left":
			let leftColor = getColorAt(row, col - 1);
			if (leftColor != null && leftColor != "transparent") {
				return { row: row, col: col - 1, color: leftColor, traveled };
			} else if (leftColor == null) {
				return false;
			} else {
				return checkColor(row, col - 1, direction, traveled);
			}
		case "right":
			let rightColor = getColorAt(row, col + 1);
			if (rightColor != null && rightColor != "transparent") {
				return { row: row, col: col + 1, color: rightColor, traveled };
			} else if (rightColor == null) {
				return false;
			} else {
				return checkColor(row, col + 1, direction, traveled);
			}
		default:
			return false;
	}
}
