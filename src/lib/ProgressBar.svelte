<script>
	import { onDestroy, onMount } from "svelte";
	import { endGame, getMetadata, isPaused } from "./store/gameState";

	let duration = 120;
	let progress = 0;
	let increment = 0.5;
	let interval;

	function newInterval() {
		return setInterval(countdown, (1000 * increment) / (100 / duration));
	}

	const countdown = () => {
		if ($isPaused) return;
		if (progress < 100) {
			progress += increment;
			return;
		}
		clearInterval(interval);
		endGame();
		interval = newInterval();
		progress = 0;
	};

	onMount(() => {
		interval = newInterval();
		return () => clearInterval(interval);
	});
</script>

<div class="w-full bg-gray-200">
	<div
		class="bg-red-700 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-x-full transition-all h-2"
		style="width: {100 - progress}%;"
	></div>
</div>
