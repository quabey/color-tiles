<script>
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from "flowbite-svelte";
	import { get, writable } from "svelte/store";
	import { getLeaderboard } from "./supabase.js";
	let items = [];

	const load = async () => {
		items = await getLeaderboard();
		console.log(items);
	};
	load();

	const sortKey = writable("highscore"); // default sort key
	const sortDirection = writable(1); // default sort direction (ascending)
	const sortItems = writable(items.slice()); // make a copy of the items array

	// Define a function to sort the items
	const sortTable = (key) => {
		// If the same key is clicked, reverse the sort direction
		if ($sortKey === key) {
			sortDirection.update((val) => -val);
		} else {
			sortKey.set(key);
			sortDirection.set(1);
		}
	};

	$: {
		const key = $sortKey;
		const direction = $sortDirection;
		const sorted = [...$sortItems].sort((a, b) => {
			const aVal = a[key];
			const bVal = b[key];
			if (aVal < bVal) {
				return -direction;
			} else if (aVal > bVal) {
				return direction;
			}
			return 0;
		});
		sortItems.set(sorted);
	}
</script>

<Table hoverable={true}>
	<TableHead>
		<TableHeadCell>User</TableHeadCell>
		<TableHeadCell on:click={() => sortTable("timed_highscore")}
			>Highscore</TableHeadCell
		>
		<TableHeadCell on:click={() => sortTable("timed_completionTime")}
			>Time</TableHeadCell
		>
		<TableHeadCell on:click={() => sortTable("timed_gamesPlayed")}
			>Games Played</TableHeadCell
		>
		<TableHeadCell on:click={() => sortTable("timed_gamesCompleted")}
			>Games Won</TableHeadCell
		>
	</TableHead>
	<TableBody>
		{#each $sortItems as item}
			<TableBodyRow>
				<TableBodyCell>{item.username}</TableBodyCell>
				<TableBodyCell>{item.timed_highscore}</TableBodyCell>
				<TableBodyCell>{item.timed_completionTime}</TableBodyCell>
				<TableBodyCell>{item.timed_gamesPlayed}</TableBodyCell>
				<TableBodyCell>{item.timed_gamesCompleted}</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
