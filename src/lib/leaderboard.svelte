<script>
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
	} from "flowbite-svelte";
	import { writable } from "svelte/store";
	import { getLeaderboard } from "./supabase.js";

	const items = writable([]); // Store for items
	const sortKey = writable("timed_highscore"); // default sort key
	const sortDirection = writable(-1); // default sort direction (ascending)

	const load = async () => {
		const leaderboardData = await getLeaderboard();
		console.log(leaderboardData);
		items.set(leaderboardData); // Update items store with loaded data
	};
	load();

	const sortTable = (key) => {
		if ($sortKey === key) {
			sortDirection.update((val) => -val);
		} else {
			sortKey.set(key);
			sortDirection.set(1);
		}
	};

	$: sortedItems = $items.slice().sort((a, b) => {
		const key = $sortKey;
		const direction = $sortDirection;
		const aVal = a[key];
		const bVal = b[key];
		return (aVal < bVal ? -1 : 1) * direction;
	});
</script>

<Table hoverable={true} class="mt-6">
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
		<TableHeadCell on:click={() => sortTable("timed_highestCombo")}
			>Highest Combo</TableHeadCell
		>
	</TableHead>
	<TableBody>
		{#each sortedItems as item}
			<TableBodyRow>
				<TableBodyCell>{item.username}</TableBodyCell>
				<TableBodyCell>{item.timed_highscore}</TableBodyCell>
				<TableBodyCell>{item.timed_completionTime}</TableBodyCell>
				<TableBodyCell>{item.timed_gamesPlayed}</TableBodyCell>
				<TableBodyCell>{item.timed_gamesCompleted}</TableBodyCell>
				<TableBodyCell>{item.timed_highestCombo}</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
