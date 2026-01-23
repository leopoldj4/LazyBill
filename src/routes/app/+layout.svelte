<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { api } from '$convex/_generated/api.js';
	import { authClient } from '$lib/auth-client';
	import BetaBadge from '$lib/components/BetaBadge.svelte';
	import DarkModeTrigger from '$lib/components/DarkModeTrigger.svelte';
	import Feedback from '$lib/components/Feedback.svelte';
	import NavHandler from '$lib/components/NavHandler.svelte';
	import NewCompany from '$lib/components/NewCompany.svelte';
	import Prompt from '$lib/components/Prompt.svelte';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Kbd from '$lib/components/ui/kbd';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { getPath } from '$lib/path.svelte';
	import { type Icon } from '@lucide/svelte';
	import BellIcon from '@lucide/svelte/icons/bell';
	import BuildingIcon from '@lucide/svelte/icons/building';
	import ChevronsUpDownIcon from '@lucide/svelte/icons/chevrons-up-down';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import CreditCardIcon from '@lucide/svelte/icons/credit-card';
	import DashboardIcon from '@lucide/svelte/icons/gauge';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import ReceiptIcon from '@lucide/svelte/icons/receipt';
	import RocketIcon from '@lucide/svelte/icons/rocket';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import SparklesIcon from '@lucide/svelte/icons/sparkles';
	import UserIcon from '@lucide/svelte/icons/user';
	import UsersIcon from '@lucide/svelte/icons/users';
	import { createSvelteAuthClient, useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import type { ConnectionState } from 'convex/browser';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';

	createSvelteAuthClient({ authClient, options: { expectAuth: true } });

	const auth = useAuth();

	let { children } = $props();

	let commandOpen = $state(false);
	let isMobile = $state(false);

	onMount(() => {
		const mediaQuery = window.matchMedia('(max-width: 1023px)');
		isMobile = mediaQuery.matches;
		const handler = (e: MediaQueryListEvent) => (isMobile = e.matches);
		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	});

	beforeNavigate(() => (commandOpen = false));

	function handleKeydown(e: KeyboardEvent) {
		if (!(e.metaKey || e.ctrlKey)) return;
		if (e.key === 'k') {
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

	const companies = useQuery(
		api.companies.getCompanies,
		() => (auth.isAuthenticated ? {} : 'skip'),
		{ initialData: [] },
	);

	type Page = {
		href: string;
		icon: typeof Icon;
		label: string;
	};
	const pages: Page[] = [
		{ href: '/app/', icon: DashboardIcon, label: 'Übersicht' },
		{ href: '/app/unpaid-invoices', icon: ReceiptIcon, label: 'Offene Rechnungen' },
		{ href: '/app/unpaid-time', icon: ClockIcon, label: 'Unbezahlte Zeiten' },
	];

	const currentUser = useQuery(api.auth.getCurrentUser, {});
	const customerCount = useQuery(
		api.companies.getTotalCustomerCount,
		() => (auth.isAuthenticated ? {} : 'skip'),
	);
	const subscriptionQuery = useQuery(
		api.subscriptions.getSubscription,
		() => (auth.isAuthenticated ? {} : 'skip'),
	);

	const FREE_CUSTOMER_LIMIT = 15;

	const subscription = $derived(subscriptionQuery.data ?? { plan: 'free', status: 'active' });
	const isPro = $derived(subscription?.plan === 'pro' && subscription?.status === 'active');
	const isNearLimit = $derived(
		!isPro && (customerCount.data ?? 0) >= FREE_CUSTOMER_LIMIT - 3,
	);
</script>

<svelte:document onkeydown={handleKeydown} />

<Sidebar.Provider>
	<NavHandler />
	<Sidebar.Root class="font-medium">
		<Sidebar.Header>
			<div class="flex items-center justify-between gap-2">
				<a class="flex items-center gap-0.5 p-2" href="/app">
					<div class="font-display text-xl">LazyBill</div>
					<BetaBadge />
				</a>
				<DarkModeTrigger />
			</div>
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

			{#if companies.data}
				<Sidebar.Group>
					<Sidebar.GroupLabel>Firmen</Sidebar.GroupLabel>
					<NewCompany />
					<Sidebar.GroupContent>
						{#each companies.data as company}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a href={`/app/company/${company._id}`} {...props}>
											<BuildingIcon />
											{company.name}
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
							<Sidebar.MenuSub>
								<Sidebar.MenuSubButton>
									{#snippet child({ props })}
										<a href={`/app/company/${company._id}/customers`} {...props}>
											<UsersIcon />
											Kunden
										</a>
									{/snippet}
								</Sidebar.MenuSubButton>
							</Sidebar.MenuSub>
							<Sidebar.MenuSub>
								<Sidebar.MenuSubButton>
									{#snippet child({ props })}
										<a href={`/app/company/${company._id}/invoices`} {...props}>
											<ReceiptIcon />
											Rechnungen
										</a>
									{/snippet}
								</Sidebar.MenuSubButton>
							</Sidebar.MenuSub>
							<Sidebar.MenuSub>
								<Sidebar.MenuSubButton>
									{#snippet child({ props })}
										<a href={`/app/company/${company._id}/time`} {...props}>
											<ClockIcon />
											Zeiterfassung
										</a>
									{/snippet}
								</Sidebar.MenuSubButton>
							</Sidebar.MenuSub>
							<Sidebar.MenuSub>
								<Sidebar.MenuSubButton>
									{#snippet child({ props })}
										<a href={`/app/company/${company._id}/settings`} {...props}>
											<SettingsIcon />
											Einstellungen
										</a>
									{/snippet}
								</Sidebar.MenuSubButton>
							</Sidebar.MenuSub>
						{/each}
					</Sidebar.GroupContent>
				</Sidebar.Group>
			{/if}
		</Sidebar.Content>
		<Sidebar.Footer>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Feedback />
				</Sidebar.MenuItem>
				<Sidebar.MenuItem>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<Sidebar.MenuButton
									size="lg"
									class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
									{...props}
								>
									<Avatar.Root class="rounded-lg">
										<Avatar.Image src={currentUser.data?.image} />
										<Avatar.Fallback class="rounded-lg">
											{currentUser.data?.name?.charAt(0)}
										</Avatar.Fallback>
									</Avatar.Root>
									{currentUser.data?.name}

									<ChevronsUpDownIcon class="ms-auto size-4" />
								</Sidebar.MenuButton>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content
							class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
							align={isMobile ? 'center' : 'end'}
							side={isMobile ? 'top' : 'right'}
							sideOffset={4}
						>
							<DropdownMenu.Item>
								<Avatar.Root class="rounded-lg">
									<Avatar.Image src={currentUser.data?.image} />
									<Avatar.Fallback class="rounded-lg">
										{currentUser.data?.name?.charAt(0)}
									</Avatar.Fallback>
								</Avatar.Root>
								{currentUser.data?.name}
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<DropdownMenu.Item>
								{#snippet child({ props })}
									<a href="/app/account" {...props}>
										<UserIcon />
										Mein Account
									</a>
								{/snippet}
							</DropdownMenu.Item>
						<DropdownMenu.Item>
							{#snippet child({ props })}
								<a href="/app/account/notifications" {...props}>
									<BellIcon />
									Benachrichtigungen
								</a>
							{/snippet}
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							{#snippet child({ props })}
								<a href="/app/account/billing" {...props}>
									<CreditCardIcon />
									Abrechnung
									{#if !isPro}
										<span class="ml-auto rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
											Free
										</span>
									{/if}
								</a>
							{/snippet}
						</DropdownMenu.Item>
						{#if currentUser.data?.email === 'mail@leoj.de'}
								<DropdownMenu.Separator />
								<DropdownMenu.Item>
									{#snippet child({ props })}
										<a href="/app/beta" {...props}>
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
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Footer>
		<Sidebar.Rail />
	</Sidebar.Root>
	<div class="h-full min-h-screen w-full">
		<div
			class="z-30 flex flex-row items-center lg:grid h-[52px] w-full lg:grid-cols-3 justify-between gap-4 border-b bg-background px-4"
		>
			<header class="flex shrink-0 items-center gap-4">
				<Sidebar.Trigger />

				<Breadcrumb.Root class="shrink-0 hidden lg:flex">
					<Breadcrumb.List>
						{@const path = getPath()}
						{#if path.length > 3}
							<Breadcrumb.Item>
								<DropdownMenu.Root>
									<DropdownMenu.Trigger class="flex items-center gap-1">
										<Breadcrumb.Ellipsis />

										<ChevronsUpDownIcon class="size-4" />
									</DropdownMenu.Trigger>
									<DropdownMenu.Content align="start">
										{#each path.slice(0, -2) as item}
											<DropdownMenu.Item>
												{#snippet child({ props })}
													<a href={item.href} {...props}>
														{item.label}
													</a>
												{/snippet}
											</DropdownMenu.Item>
										{/each}
									</DropdownMenu.Content>
								</DropdownMenu.Root>
							</Breadcrumb.Item>

							<Breadcrumb.Separator />

							<Breadcrumb.Item>
								<Breadcrumb.Link href={path[path.length - 2].href}
									>{path[path.length - 2].label}</Breadcrumb.Link
								>
							</Breadcrumb.Item>

							<Breadcrumb.Separator />

							<Breadcrumb.Item>
								<Breadcrumb.Link href={path[path.length - 1].href}
									>{path[path.length - 1].label}</Breadcrumb.Link
								>
							</Breadcrumb.Item>
						{:else}
							{#each path as item, index}
								<Breadcrumb.Item>
									<Breadcrumb.Link href={item.href}>{item.label}</Breadcrumb.Link>
								</Breadcrumb.Item>
								{#if index < getPath().length - 1}
									<Breadcrumb.Separator />
								{/if}
							{/each}
						{/if}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</header>

			<button
				onclick={() => (commandOpen = true)}
				class="flex h-9 w-full lg:shrink-0 cursor-text items-center justify-between gap-2 rounded-md bg-muted px-4 text-sm text-muted-foreground lg:min-w-[15vw]"
			>
				<div class="w-[20px] max-lg:hidden"></div>

				<div class="flex items-center gap-2">
					<SearchIcon class="size-4" />
					Schnellsuche
				</div>

				<Kbd.Group class="max-lg:hidden">
					<Kbd.Root class="border">⌘K</Kbd.Root>
				</Kbd.Group>
			</button>

			<div class="flex shrink-0 items-center justify-end gap-2">
				{#if isNearLimit && !isPro}
					<a
						href="/app/account/billing"
						class="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:from-amber-600 hover:to-orange-600 hover:shadow-md"
					>
						<SparklesIcon class="size-4" />
						<span class="hidden sm:inline">Upgrade</span>
					</a>
				{/if}
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
			</div>
		</div>
		<div class="flex w-full flex-col gap-6 p-8 max-lg:pb-32">
			{@render children?.()}
		</div>
	</div>
</Sidebar.Provider>

<Prompt />
<Toaster position="top-right" />
<ModeWatcher />

<Command.Dialog bind:open={commandOpen}>
	<Command.Input placeholder="Suche..." />
	<Command.List>
		<Command.Empty>Keine Ergebnisse gefunden.</Command.Empty>
		<Command.Group heading="Firmen">
			{#each companies.data as company}
				<Command.Item>
					{#snippet child({ props })}
						<a href={`/app/company/${company._id}`} {...props}>
							<BuildingIcon />
							{company.name}
						</a>
					{/snippet}
				</Command.Item>
			{/each}
		</Command.Group>
		<Command.Group heading="Seiten">
			{#each pages as page}
				<Command.Item>
					{#snippet child({ props })}
						<a href={page.href} {...props}>
							<page.icon />
							{page.label}
						</a>
					{/snippet}
				</Command.Item>
			{/each}
		</Command.Group>
	</Command.List>
</Command.Dialog>
