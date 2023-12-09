<script>
	import { onMount } from "svelte";
	import NewGame from "./newGame.svelte";

	import {
		initGameState,
		handleTileClick,
		isPaused,
	} from "./store/gameState";

	import { Modal } from "flowbite-svelte";
	import { leaderBoardModal } from "./store/leaderBoardState";
	import { settingsModal } from "./store/settingsState";

	let cellSize = 0;

	let gameState = initGameState();

	function resizeGrid() {
		const maxWidth = window.innerWidth;
		const maxHeight = window.innerHeight;
		const gridWidth = maxWidth * 0.7; // 90% of the viewport width
		const gridHeight = maxHeight * 0.7; // 90% of the viewport height

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

	// Partical when tile is distroyed
	/** @type {import('svelte/action').Action}  */
	function tileEventManager(node, { state }) {
		// the node has been mounted in the DOM
		return {
			update(newValue) {
				// state has changed
				if (newValue === undefined || newValue?.state === state) return;
				// do emit partical effect explosion
				console.log("Emitting destroy", state, " -> ", newValue?.state);

				node.dispatchEvent(
					new CustomEvent("explosion", {
						detail: {
							msg: "Tile has been exploded",
							meta_data: {
								oldState: state,
								newState: newValue?.state,
							},
						},
					}),
				);
				state = newValue?.state;
			},
			destroy() {
				// the node has been removed from the DOM
			},
		};
	}

	// // PARTICAL STUFF
	function particle(creation_tick, start, end, duration, lifespan, velocity) {
		(this.creation_tick = creation_tick),
			(this.start = start),
			(this.age = 0);
		(this.end = end),
			(this.duration = duration),
			(this.lifespan = lifespan),
			(this.velocity = velocity),
			(this.appearance_params = {
				scale: [1.5, 0],
				opacity: [1, 0],
			});
	}

	// Emit destroy partical effect More PARTICAL STUFF
	async function emitExplodePartical(tileEl) {
		const particle_container = tileEl.target;
		particle_container.style.background_color =
			tileEl.detail.meta_data.newState;
		const spawn = [50, 50];
		// [tileEl.target.offsetLeft, tileEl.target.offsetTop];

		var particles = [];
		var tick = 0;

		var start_timestamp, previous_timestamp;
		function doParticles(TS) {
			if (start_timestamp === undefined) {
				start_timestamp = TS;
			}
			const elapsed = TS - previous_timestamp;

			// if(tick % 1 === 0){
			if (previous_timestamp !== TS) {
				particle_container.innerHTML = "";

				particles.forEach(function (p, i) {
					if (p.age < p.lifespan) {
						drawParticle(
							lerp(p.start, p.end, p.age / p.lifespan),
							p.age / p.lifespan,
							p.appearance_params,
						);
						p.age += p.velocity * (elapsed * 0.05);
					}

					if (tick > p.creation_tick + p.lifespan) {
						particles.splice(i, 1);
					}
				});
			}

			previous_timestamp = TS;
			tick++;
			window.requestAnimationFrame(doParticles);
		}

		window.requestAnimationFrame(doParticles);

		function createParticle(start, max_distance) {
			var creation_tick = tick;
			var ofs = [start[0], start[1]];
			var end = polarToCartesian(
				Math.random() * 360,
				Math.random() * max_distance,
				ofs,
			);
			var duration = 100;
			var lifespan = 100;
			var velocity = 3;

			var part = new particle(
				creation_tick,
				start,
				end,
				duration,
				lifespan,
				velocity,
			);
			particles.push(part);
		}

		function drawParticle(pos, age, appearance_params) {
			//var fragment_node = document.createDocumentFragment();
			var node = document.createElement("div");
			node.style.position = "absolute";
			node.style.zIndex = "5";
			node.style.left = pos[0] + "%";
			node.style.top = pos[1] + "%";
			node.style.width = 3 + "px";
			node.style.height = 3 + "px";
			node.style.borderRadius = "50%";
			node.style.transform = "translate(-50%, -50%)";
			node.style.backgroundColor = tileEl.detail.meta_data.oldState;
			var transform_properties = [
				"translate",
				"translateX",
				"translateY",
				"scale",
				"scaleX",
				"scaleY",
				"scaleZ",
				"rotate",
				"rotateX",
				"rotateY",
				"rotateZ",
			];
			Object.keys(appearance_params).forEach(function (k) {
				if (transform_properties.includes(k)) {
					node.style.transform =
						k +
						"(" +
						lerp(
							[appearance_params[k][0]],
							[appearance_params[k][1]],
							age,
						) +
						")";
				} else {
					node.style[k] = lerp(
						[appearance_params[k][0]],
						[appearance_params[k][1]],
						age,
					);
				}
			});
			particle_container.appendChild(node);
		}

		function polarToCartesian(angle, length, offset) {
			var output = [offset[0], offset[1]];
			var rad = degToRad(angle);
			output[0] += length * Math.cos(rad);
			output[1] += length * Math.sin(rad);
			return output;
		}
		function degToRad(deg) {
			return deg * (Math.PI / 180);
		}

		function lerp(P, Q, t) {
			var output = [];
			if (t < 0) {
				t = 0;
			}
			if (t > 1) {
				t = 1;
			}

			var i = 0;
			while (i < P.length) {
				output.push(P[i] + t * (Q[i] - P[i]));
				i++;
			}
			return output;
		}

		// Create each of the particals
		var max_particles = 100;
		var max_distance = 300;

		setTimeout(() => {
			for (let i = 0; i < max_particles; i++) {
				createParticle(spawn, max_distance);
			}
		}, 2500);
	}

	let gameBoardEl;
	// Emit grid axis
	let crossGrid = { row: 0, col: 0 };
	// Updates the current cross grid axis and emits the event to the tiles
	async function updateGridAxis(TileEl, select) {
		crossGrid = select;
		// Emit Grid axis change
		// gameBoardEl.target.offsetParent.offsetParent
		for (let tileEl of gameBoardEl.children) {
			tileEl.dispatchEvent(
				new CustomEvent("gridAxis", {
					detail: {
						msg: "Tile Update Grid Highlights Axis",
					},
				}),
			);
		}
	}

	// Consumer of the grid axis event emitted by the tiles when the grid axis changes
	function emitGridAxis(tileEl, rowIndex, colIndex) {
		if (crossGrid.row === rowIndex || crossGrid.col === colIndex) {
			tileEl.target.style.backgroundColor = "rgb(209, 203, 203)";
		} else {
			tileEl.target.style.backgroundColor = "transparent";
		}
	}
</script>

<Modal bind:open={$isPaused} dismissable={false}>
	<NewGame />
</Modal>

<div class="relative z-0 w-min border-2 border-black border-solid mx-auto">
	<div
		class={$isPaused || $leaderBoardModal || $settingsModal
			? "gamegrid relative blur-sm"
			: "gamegrid relative"}
		bind:this={gameBoardEl}
	>
		<!-- style={`width: ${23 * cellSize + 22}px; height: ${
			15 * cellSize + 14
		}px;`} -->
		{#each $gameState.grid as row, rowIndex}
			{#each row as cell, colIndex}
				<div
					class="relative"
					on:gridAxis={function (el) {
						emitGridAxis(el, rowIndex, colIndex);
					}}
				>
					<!-- class:highlighted={colIndex == currentHover.col ||
						rowIndex == currentHover.row} -->
					<button
						disabled={$isPaused ||
							$leaderBoardModal ||
							$settingsModal}
						class="cell rounded-lg drop-shadow-xl mx-[3px]"
						style={`width: ${cellSize}px; height: ${cellSize}px; background-color: ${
							cell || "transparent"
						};`}
						on:click={() => handleTileClick(rowIndex, colIndex)}
						use:tileEventManager={{ state: cell }}
						on:explosion={emitExplodePartical}
						on:mouseenter={(el) => {
							// Only show grid axis when its a valid position
							// if (cell !== "transparent") return;
							updateGridAxis(el, {
								row: rowIndex,
								col: colIndex,
							});
						}}
					>
					</button>
				</div>
			{/each}
		{/each}
	</div>
</div>

<style>
	.gamegrid {
		display: grid;
		grid-template-columns: repeat(23, 1fr);
		grid-gap: 0;
		/* position: relative; */
		/* color: red; */
	}

	.cell {
		aspect-ratio: 1 / 1;
		box-sizing: border-box;
	}

	button.cell > div {
		position: absolute;
		z-index: 5;
		top: 0px;
		left: 0px;
		display: block;
		width: 3px;
		height: 3px;
		color: inherit;
		background-color: inherit;
		border: 1px solid inherit;
		border-radius: 50%;
		box-sizing: border-box;
	}

	.highlighted {
		background-color: rgb(209, 203, 203);
	}
</style>
