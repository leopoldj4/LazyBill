<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import { api } from '$convex/_generated/api.js';
	import Logo from '$lib/assets/logo.svg';
	import { authClient } from '$lib/auth-client';
	import BetaBadge from '$lib/components/BetaBadge.svelte';
	import Prompt from '$lib/components/Prompt.svelte';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Command from '$lib/components/ui/command';
	import * as Kbd from '$lib/components/ui/kbd';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import type { Icon } from '@lucide/svelte';
	import BuildingIcon from '@lucide/svelte/icons/building';
	import ReceiptIcon from '@lucide/svelte/icons/receipt';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import UsersIcon from '@lucide/svelte/icons/users';
	import { createSvelteAuthClient, useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import type { ConnectionState } from 'convex/browser';

	import { onMount } from 'svelte';

	createSvelteAuthClient({ authClient, options: { expectAuth: true } });

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

	type Page = {
		href: string;
		icon: typeof Icon;
		label: string;
	};
	const pages: Page[] = [
		{ href: '/app/customers', icon: UsersIcon, label: 'Kunden' },
		{ href: '/app/invoices', icon: ReceiptIcon, label: 'Rechnungen' },
		//{ href: '/app/time', icon: ClockIcon, label: 'Zeiterfassung' },
	];
</script>

<svelte:document onkeydown={handleKeydown} />

<Command.Dialog bind:open={commandOpen}>
	<Command.Input placeholder="Gib einen Befehl ein oder suche..." />
	<Command.List>
		<Command.Empty>Keine Ergebnisse gefunden.</Command.Empty>
		<Command.Group heading="Seiten">
			{#each pages as page}
				<Command.LinkItem href={page.href}><page.icon /> {page.label}</Command.LinkItem>
			{/each}
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

<div class="h-full min-h-screen">
	<div
		class="fixed top-0 z-30 flex h-[52px] w-full max-w-screen flex-row items-center justify-between gap-4 border-b bg-white px-8"
	>
		<header class="flex shrink-0 items-center gap-2">
			<a class="mr-4 flex shrink-0 items-center gap-1" href="/app">
				<img src={Logo} alt="LazyBill Logo" class="size-8" />
				<div class="font-display text-xl max-lg:hidden">LazyBill</div>
				<BetaBadge />
			</a>
			<button
				onclick={() => (commandOpen = true)}
				class="hidden h-9 w-[90%] shrink-0 cursor-text items-center justify-between gap-2 rounded-md bg-gray-100 px-4 text-sm text-gray-600 lg:flex lg:w-full lg:max-w-sm lg:min-w-[15vw]"
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
			<div class="flex flex-row max-lg:hidden">
				{#each pages as page (page.href)}
					<a href={page.href} class={buttonVariants({ variant: 'ghost' })}> {page.label} </a>
				{/each}
			</div>
		</header>

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
			<a href="/app/settings" class="{buttonVariants({ variant: 'ghost' })}">
				<SettingsIcon class="size-4" />
				<span class="hidden lg:block">Einstellungen</span>
			</a>
		</div>
	</div>
	<div class="mt-[52px] flex flex-col gap-6 p-8 max-lg:pb-32">
		{@render children?.()}
	</div>

	<div
		class="fixed right-0 bottom-0 left-0 grid grid-cols-2 justify-between gap-2 border-t bg-white p-4 px-4 lg:hidden"
	>
		{#each pages as item}
			<a
				href={item.href}
				class="flex flex-col items-center justify-center gap-2 {page.url.pathname.startsWith(
					item.href,
				)
					? 'text-primary'
					: 'text-gray-400'}"
			>
				<item.icon class="size-4"></item.icon>
				{item.label}
			</a>
		{/each}
	</div>
</div>

<Toaster position="top-right" />
<Prompt />
