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
</script>

<div class="">
	<h1>Stats</h1>

</div>