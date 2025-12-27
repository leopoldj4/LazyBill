<script lang="ts">
	import { api } from '$convex/_generated/api.js';
	import Logo from '$lib/assets/logo.png';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Command from '$lib/components/ui/command';
	import { Spinner } from '$lib/components/ui/spinner';
	import { BuildingIcon, LogOutIcon, SearchIcon, SettingsIcon } from '@lucide/svelte';
	import UsersIcon from '@lucide/svelte/icons/users';
	import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import type { ConnectionState } from 'convex/browser';
	import { onMount } from 'svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { authClient } from '$lib/auth-client';
	import { beforeNavigate, goto } from '$app/navigation';

	const { children } = $props();
	const auth = useAuth();

	let isOpen = $state(false);
	let commandOpen = $state(false);

	beforeNavigate(() => (commandOpen = false));

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			commandOpen = !commandOpen;
		}
	}

	const client = useConvexClient();
	let status: ConnectionState = $state(client.connectionState());

	onMount(() => {
		const unsubscribe = client.subscribeToConnectionState((newState) => {
			status = newState;
		});

		return unsubscribe;
	});

	const query = useQuery(api.customers.list, () => (auth.isAuthenticated ? {} : 'skip'));
</script>

<svelte:document onkeydown={handleKeydown} />

<Command.Dialog bind:open={commandOpen}>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>Keine Ergebnisse gefunden.</Command.Empty>
		<Command.Group heading="Seiten">
			<Command.LinkItem href="/app/customers"><UsersIcon /> Kunden</Command.LinkItem>
			<Command.LinkItem href="/app/settings"><BuildingIcon /> Einstellungen</Command.LinkItem>
		</Command.Group>
		<Command.Separator />
		{#if query.data}
			<Command.Group heading="Kunden">
				{#each query.data as customer}
					<Command.LinkItem href={`/app/customers/${customer._id}`}
						><UsersIcon /> {customer.name}</Command.LinkItem
					>
				{/each}
			</Command.Group>
		{/if}
		<Command.Group heading="Einstellungen">
			<Command.LinkItem href="/app/settings/company"><BuildingIcon /> Meine Firma</Command.LinkItem>
		</Command.Group>
	</Command.List>
</Command.Dialog>

{#if auth.isLoading}
	<div class="flex h-screen w-full items-center justify-center">
		<Spinner />
	</div>
{:else}
	<div class="h-screen">
		<div class="flex h-[52px] w-full flex-row items-center justify-between px-4">
			<header class="flex items-center gap-2 pr-2">
				<a class="mr-4 flex shrink-0 items-center gap-1" href="/app">
					<img src={Logo} alt="Watchtower Logo" class="-mt-3 size-8" />
					<div class="font-display text-xl">Watchtower</div>
				</a>

				<button
					onclick={() => (commandOpen = true)}
					class=" hidden h-9 w-full max-w-lg min-w-[15vw] shrink-0 cursor-text items-center justify-center gap-2 rounded-md bg-gray-100 text-sm text-gray-600 lg:flex"
				>
					Quick Switcher
					<SearchIcon class="size-4" />
				</button>
			</header>
			<div class="flex items-center justify-between">
				<div class="hidden lg:block">
					{#if status.isWebSocketConnected}
						<div
							class="mr-4 flex animate-fade-out items-center gap-2 text-sm text-gray-600 ease-in fill-mode-forwards"
						>
							<div class="size-2 animate-pulse rounded-full bg-green-500"></div>
							Verbunden
						</div>
					{:else if status.hasEverConnected}
						<div class="mr-4 flex items-center gap-2 text-sm text-gray-600">
							<div class="size-2 rounded-full bg-red-500"></div>
							Getrennt
						</div>
					{:else}
						<div class="mr-4 flex items-center gap-2 text-sm text-gray-600">
							<div
								class="size-2 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"
							></div>
							Verbinden...
						</div>
					{/if}
				</div>
				<a href="/app/settings" class={buttonVariants({ variant: 'ghost' })}>
					<SettingsIcon class="size-4" />
					<span class="hidden lg:block">Einstellungen</span>
				</a>
				<Button
					variant="ghost"
					onclick={async () => {
						authClient.signOut();
						await goto('/login');
					}}
				>
					<LogOutIcon class="size-4" />
					<span class="hidden lg:block">Abmelden</span>
				</Button>
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
{/if}

<Toaster position="top-center" />
