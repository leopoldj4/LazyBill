<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { api } from '$convex/_generated/api.js';
	import Logo from '$lib/assets/logo.png';
	import Prompt from '$lib/components/Prompt.svelte';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Kbd from '$lib/components/ui/kbd';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { Spinner } from '$lib/components/ui/spinner';
	import { BuildingIcon, Code, SearchIcon, SettingsIcon } from '@lucide/svelte';
	import UsersIcon from '@lucide/svelte/icons/users';
	import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import type { ConnectionState } from 'convex/browser';
	import { onMount } from 'svelte';

	const { children } = $props();
	const auth = useAuth();

	$effect(() => {
		if (!auth.isLoading && !auth.isAuthenticated) {
			goto('/login');
		}
	});

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
	<Command.Input placeholder="Gib einen Befehl ein oder suche..." />
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
	<div class="h-full min-h-screen">
		<div
			class="fixed top-0 z-30 flex h-[52px] w-full max-w-screen flex-row items-center justify-between gap-4 bg-white px-8"
		>
			<header class="flex shrink-0 items-center gap-2">
				<a class="mr-4 flex shrink-0 items-center gap-1" href="/app">
					<img src={Logo} alt="LazyBill Logo" class="-mt-3 size-8" />
					<div class="font-display text-xl max-lg:hidden">LazyBill</div>
				</a>
			</header>
			<button
				onclick={() => (commandOpen = true)}
				class="flex h-9 w-[90%] cursor-text items-center justify-between gap-2 rounded-md bg-gray-100 text-sm text-gray-600 lg:w-full lg:max-w-lg lg:min-w-[15vw] px-4"
			>
				<div class="w-[57px] max-lg:hidden"></div>

				<div class="flex items-center gap-2">
					<SearchIcon class="size-4" />
					Schnellsuche
				</div>

				<Kbd.Group class="max-lg:hidden">
					<Kbd.Root class="border">⌘</Kbd.Root>+
					<Kbd.Root class="border">K</Kbd.Root>
				</Kbd.Group>
			</button>
			<div class="flex shrink-0 items-center justify-between">
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
			</div>
		</div>
		<div class="mt-[52px] flex flex-col gap-6 p-8">
			{@render children?.()}
		</div>
	</div>
{/if}

<Toaster position="top-right" />
<Prompt />
