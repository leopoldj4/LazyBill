<script lang="ts">
	import Logo from '$lib/assets/logo.png';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Command from '$lib/components/ui/command';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { BuildingIcon, ChevronDownIcon, LogOutIcon, SearchIcon } from '@lucide/svelte';
	import UsersIcon from '@lucide/svelte/icons/users';
	import { DropdownMenu } from 'bits-ui';
	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from 'convex-svelte';
	import { useConvexClient } from 'convex-svelte';
	import { onMount } from 'svelte';
	import type { ConnectionState } from 'convex/browser';

	setupConvex(PUBLIC_CONVEX_URL);

	const { children } = $props();

	let isOpen = $state(false);
	let signoutForm: HTMLFormElement;
	let commandOpen = $state(false);

	function handleSignOut() {
		signoutForm.requestSubmit();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			commandOpen = !commandOpen;
		}
	}

	const closeCommand = () => (commandOpen = false);

	const client = useConvexClient();
	let status: ConnectionState = $state(client.connectionState());

	onMount(() => {
		const unsubscribe = client.subscribeToConnectionState((newState) => {
			status = newState;
		});

		return unsubscribe;
	});

	import { useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api.js';

	const query = useQuery(api.customers.list, {});
</script>

<svelte:document onkeydown={handleKeydown} />

<Command.Dialog bind:open={commandOpen}>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>Keine Ergebnisse gefunden.</Command.Empty>
		<Command.Group heading="Seiten">
			<Command.LinkItem href="/app/customers" onclick={closeCommand}
				><UsersIcon /> Kunden</Command.LinkItem
			>
			<Command.LinkItem href="/app/settings" onclick={closeCommand}
				><BuildingIcon /> Einstellungen</Command.LinkItem
			>
		</Command.Group>
		<Command.Separator />
		{#if query.data}
			<Command.Group heading="Kunden">
				{#each query.data as customer}
					<Command.LinkItem href={`/app/customers/${customer._id}`} onclick={closeCommand}
						><UsersIcon /> {customer.name}</Command.LinkItem
					>
				{/each}
			</Command.Group>
		{/if}
		<Command.Group heading="Einstellungen">
			<Command.LinkItem href="/app/settings/company" onclick={closeCommand}
				><BuildingIcon /> Meine Firma</Command.LinkItem
			>
		</Command.Group>
	</Command.List>
</Command.Dialog>

<div class="h-screen">
	<div class="flex h-[52px] w-full flex-row items-center justify-between px-4">
		<header class="flex items-center gap-2 pr-2">
			<a class="mr-4 flex shrink-0 items-center gap-1" href="/app">
				<img src={Logo} alt="Watchtower Logo" class="-mt-3 size-8" />
				<div class="font-display text-xl">Watchtower</div>
			</a>

			<button
				onclick={() => (commandOpen = true)}
				class="flex h-9 w-full max-w-lg min-w-[15vw] shrink-0 cursor-text items-center justify-center gap-2 rounded-md bg-gray-100 text-sm text-gray-600"
			>
				Quick Switcher
				<SearchIcon class="size-4" />
			</button>
		</header>
		<div class="flex items-center justify-between">
			{#if status.isWebSocketConnected}
				<div class="mr-4 flex items-center gap-2 text-sm text-gray-600">
					<div class="size-2 animate-pulse rounded-full bg-green-500"></div>
					Connected
				</div>
			{:else if status.hasEverConnected}
				<div class="mr-4 flex items-center gap-2 text-sm text-gray-600">
					<div class="size-2 rounded-full bg-red-500"></div>
					Disconnected
				</div>
			{:else}
				<div class="mr-4 flex items-center gap-2 text-sm text-gray-600">
					<div
						class="size-2 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"
					></div>
					Connecting...
				</div>
			{/if}
			<a href="/app/settings" class={buttonVariants({ variant: 'ghost' })}>Einstellungen</a>
		</div>
	</div>
	<div
		class={[
			'flex flex-col gap-6 border-l border-border p-8',
			!isOpen && 'col-span-2',
			isOpen && 'rounded-tl-md',
		]}
	>
		{@render children?.()}
	</div>
</div>

<form bind:this={signoutForm} method="POST" action="/app?/signout" class="hidden"></form>
