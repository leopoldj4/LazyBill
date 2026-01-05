<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/state';
	import { api } from '$convex/_generated/api.js';
	import { authClient } from '$lib/auth-client';
	import BetaBadge from '$lib/components/BetaBadge.svelte';
	import DarkModeTrigger from '$lib/components/DarkModeTrigger.svelte';
	import NavHandler from '$lib/components/NavHandler.svelte';
	import Prompt from '$lib/components/Prompt.svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Command from '$lib/components/ui/command';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Kbd from '$lib/components/ui/kbd';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { type Icon } from '@lucide/svelte';
	import BanknoteIcon from '@lucide/svelte/icons/banknote';
	import BellIcon from '@lucide/svelte/icons/bell';
	import BuildingIcon from '@lucide/svelte/icons/building';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import ReceiptIcon from '@lucide/svelte/icons/receipt';
	import RocketIcon from '@lucide/svelte/icons/rocket';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import UserIcon from '@lucide/svelte/icons/user';
	import UsersIcon from '@lucide/svelte/icons/users';
	import { createSvelteAuthClient, useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import type { ConnectionState } from 'convex/browser';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';

	createSvelteAuthClient({ authClient, options: { expectAuth: true } });

	const { children, data } = $props();
	const auth = useAuth();

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
		{ href: '/app/time', icon: ClockIcon, label: 'Zeiterfassung' },
	];

	const currentUser = useQuery(api.auth.getCurrentUser, {});
	const settingsNavLinks = [
		{ href: '/app/settings/company', icon: BuildingIcon, label: 'Meine Firma' },
		{ href: '/app/settings/bank', icon: BanknoteIcon, label: 'Bank' },
		{ href: '/app/settings/notifications', icon: BellIcon, label: 'Benachrichtigungen' },
		{ href: '/app/settings/invoices', icon: ReceiptIcon, label: 'Rechnungen' },
		{ href: '/app/settings/account', icon: UserIcon, label: 'Account' },
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

<Sidebar.Provider>
	<NavHandler />
	<Sidebar.Root>
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<DropdownMenu.Root>
					  <DropdownMenu.Trigger>
						{#snippet child({ props })}
						  <Sidebar.MenuButton {...props}>
							LazyBill
							<ChevronDownIcon class="ms-auto" />
						  </Sidebar.MenuButton>
						{/snippet}
					  </DropdownMenu.Trigger>
					  <DropdownMenu.Content class="w-(--bits-dropdown-menu-anchor-width)">
						<DropdownMenu.Item>
						  <span>Acme Inc</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
						  <span>Acme Corp.</span>
						</DropdownMenu.Item>
					  </DropdownMenu.Content>
					</DropdownMenu.Root>
				  </Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>

		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.Menu>
					{#each pages as page}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={page.href} {...props}>
										<page.icon class="size-4" />
										{page.label}
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.Group>
			<Collapsible.Root class="group/collapsible">
				<Sidebar.Group>
					<Sidebar.GroupLabel
						class="text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
					>
						{#snippet child({ props })}
							<Collapsible.Trigger {...props}>
								Einstellungen
								<ChevronDownIcon
									class="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
								/>
							</Collapsible.Trigger>
						{/snippet}
					</Sidebar.GroupLabel>
					<Collapsible.Content>
						<Sidebar.GroupContent>
							{#each settingsNavLinks as link}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton>
										{#snippet child({ props })}
											<a href={link.href} {...props}>
												<link.icon class="size-4" />
												{link.label}
											</a>
										{/snippet}
									</Sidebar.MenuButton>
								</Sidebar.MenuItem>
							{/each}
						</Sidebar.GroupContent>
					</Collapsible.Content>
				</Sidebar.Group>
			</Collapsible.Root>
		</Sidebar.Content>
		<Sidebar.Footer></Sidebar.Footer>
		<Sidebar.Rail />
	</Sidebar.Root>
	<div class="h-full min-h-screen w-full">
		<div
			class="z-30 flex h-[52px] w-full flex-row items-center justify-between gap-4 border-b bg-background px-8"
		>
			<header class="flex shrink-0 items-center gap-2">
				<Sidebar.Trigger />

				<a class="flex items-center gap-1 p-4" href="/app">
					<div class="font-display text-xl">LazyBill</div>
					<BetaBadge />
				</a>

				<button
					onclick={() => (commandOpen = true)}
					class="hidden h-9 w-[90%] shrink-0 cursor-text items-center justify-between gap-2 rounded-md bg-muted px-4 text-sm text-muted-foreground lg:flex lg:w-full lg:max-w-sm lg:min-w-[15vw]"
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
			</header>

			<div class="flex shrink-0 items-center justify-between gap-2">
				<div class="hidden lg:block">
					{#if status.hasEverConnected}
						<div class="mr-4 flex items-center gap-2 text-sm text-gray-600">
							<div class="size-2 rounded-full bg-red-500"></div>
							Getrennt
						</div>
					{:else if !status.isWebSocketConnected}
						<div class="mr-4 flex items-center gap-2 text-sm text-gray-600">
							<div
								class="size-2 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"
							></div>
							Verbinden...
						</div>
					{/if}
				</div>

				<DarkModeTrigger />
				<a href="/app/settings" class={buttonVariants({ variant: 'ghost' })}>
					<SettingsIcon class="size-4" />
					<span class="hidden lg:block">Einstellungen</span>
				</a>

				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button variant="ghost" {...props}>
								{currentUser.data?.name}
								<Avatar.Root class="size-6">
									<Avatar.Image src={currentUser.data?.image} />
									<Avatar.Fallback>
										{currentUser.data?.name?.charAt(0)}
									</Avatar.Fallback>
								</Avatar.Root>
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-40" align="end">
						<DropdownMenu.Item>
							{#snippet child({ props })}
								<a href="/app/settings/account" {...props}>
									<UserIcon />
									Mein Account
								</a>
							{/snippet}
						</DropdownMenu.Item>
						{#if currentUser.data?.email === 'mail@leoj.de'}
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								{#snippet child({ props })}
									<a href="/app/settings/beta" {...props}>
										<RocketIcon />
										Beta
									</a>
								{/snippet}
							</DropdownMenu.Item>
						{/if}
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<LogOutIcon />
							Logout
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
		<div class="flex w-full flex-col gap-6 p-8 max-lg:pb-32">
			{@render children?.()}
		</div>

		<div
			class="fixed right-0 bottom-0 left-0 grid grid-cols-3 justify-between gap-2 border-t bg-background p-4 px-4 lg:hidden"
		>
			{#each pages as item}
				<a
					href={item.href}
					class="flex flex-col items-center justify-center gap-2 {page.url.pathname.startsWith(
						item.href,
					)
						? 'text-primary'
						: 'text-muted-foreground'}"
				>
					<item.icon></item.icon>
					{item.label}
				</a>
			{/each}
			<button
				class="flex flex-col items-center justify-center gap-2 text-muted-foreground"
				onclick={() => (commandOpen = true)}
			>
				<SearchIcon></SearchIcon>
				Suche
			</button>
		</div>
	</div>
</Sidebar.Provider>

<Prompt />
<Toaster position="top-right" />
<ModeWatcher />
