<script>
	import { Button, Modal, Label, Input, Checkbox } from "flowbite-svelte";
	let formModal = false;

	let isAuthed = false;
</script>

<nav
	class="bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 mb-10"
>
	<div
		class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
	>
		<Button class="flex items-center space-x-3 rtl:space-x-reverse">
			<span
				class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
				>Colour-Tile</span
			>
		</Button>

		<div class="hidden w-full md:block md:w-auto" id="navbar-dropdown">
			<ul
				class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
			>
				{#if isAuthed === false}
					<li>
						<Button
							on:click={() => (formModal = true)}
							class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
							aria-current="page">Login</Button
						>
					</li>
				{:else}
					<li>
						<Button
							class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
							aria-current="page">Logout</Button
						>
					</li>
				{/if}
				<li>
					<Button
						class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
						aria-current="page"
						>LeaderBoard
					</Button>
				</li>
				<li>
                    <!-- TODO: Only show if the game isnt paused and reset grid on grid -->
					<Button
						class="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500 dark:bg-blue-600 md:dark:bg-transparent"
						aria-current="page"
						>Restart
					</Button>
				</li>
			</ul>
		</div>
	</div>
</nav>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" action="#">
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
			Sign in to our platform
		</h3>
		<Label class="space-y-2">
			<span>Email</span>
			<Input
				type="email"
				name="email"
				placeholder="name@company.com"
				required
			/>
		</Label>
		<Label class="space-y-2">
			<span>Your password</span>
			<Input
				type="password"
				name="password"
				placeholder="•••••"
				required
			/>
		</Label>
		<div class="flex items-start">
			<Checkbox>Remember me</Checkbox>
			<a
				href="/"
				class="ms-auto text-sm text-primary-700 hover:underline dark:text-primary-500"
			>
				Lost password?
			</a>
		</div>
		<Button type="submit" class="w-full1">Login to your account</Button>
		<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
			Not registered? <a
				href="/"
				class="text-primary-700 hover:underline dark:text-primary-500"
			>
				Create account
			</a>
		</div>
	</form>
</Modal>
