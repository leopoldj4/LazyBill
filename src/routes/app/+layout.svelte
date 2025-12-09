<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import NavItem from './NavItem.svelte';
	import UsersIcon from '@lucide/svelte/icons/users';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import InvoiceIcon from '@lucide/svelte/icons/file-text';
	import type { Icon as IconType } from '@lucide/svelte';
	let { children, data } = $props();
	import Logo from './icon.png';
	import {
		BuildingIcon,
		ChevronDownIcon,
		GaugeCircleIcon,
		LogOutIcon,
		SearchIcon,
		SidebarCloseIcon,
		SidebarOpenIcon,
	} from '@lucide/svelte';
	import { DropdownMenu } from 'bits-ui';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Command from '$lib/components/ui/command';

	let isOpen = $state(true);

	let signoutForm: HTMLFormElement;

	function handleSignOut() {
		signoutForm.requestSubmit();
	}

	let commandOpen = $state(false);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			commandOpen = !commandOpen;
		}
	}

	const closeCommand = () => (commandOpen = false);

	type Page = {
		href: string;
		icon: typeof IconType;
		title: string;
	};

	const pages = [
		{ href: '/app', icon: GaugeCircleIcon, title: 'Dashboard' },
		{ href: '/app/customers', icon: UsersIcon, title: 'Customers' },
		{ href: '/app/time-tracking', icon: ClockIcon, title: 'Time Tracking' },
		{ href: '/app/invoices', icon: InvoiceIcon, title: 'Invoices' },
	];
</script>

<svelte:document onkeydown={handleKeydown} />

<Command.Dialog bind:open={commandOpen}>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>No results found.</Command.Empty>
		<Command.Group heading="Pages">
			{#each pages as page}
				<Command.LinkItem href={page.href} onclick={closeCommand}><page.icon /> {page.title}</Command.LinkItem>
			{/each}
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Settings">
			<Command.LinkItem href="/app/company" onclick={closeCommand}><BuildingIcon /> Manage company</Command.LinkItem>
			<Command.LinkItem href="/app/account" onclick={closeCommand}><UsersIcon /> My account</Command.LinkItem>
		</Command.Group>
	</Command.List>
</Command.Dialog>

<div class="grid h-screen grid-cols-[256px_1fr] grid-rows-[52px_1fr]">
	<header class="flex items-center justify-between pr-2 pl-4">
		<a class="flex items-center gap-1" href="/app">
			<img src={Logo} alt="Tempora" class="-mt-3 size-8" />
			<div class="font-display text-xl">tempora</div>
		</a>
		<button
			class="grid h-9 w-9 place-items-center rounded-md hover:bg-gray-100"
			onclick={() => (isOpen = !isOpen)}
		>
			{#if isOpen}
				<SidebarCloseIcon class="size-4" />
			{:else}
				<SidebarOpenIcon class="size-4" />
			{/if}
		</button>
	</header>
	<div class="flex items-center justify-between pr-4">
		<button
			onclick={() => (commandOpen = true)}
			class="flex h-9 w-full max-w-lg min-w-[20vw] cursor-text items-center justify-center gap-2 rounded-md bg-gray-100 text-sm text-gray-600"
		>
			Quick Switcher
			<SearchIcon class="size-4" />
		</button>

		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				class="flex h-9 flex-row items-center justify-end gap-2 rounded-md px-4 hover:bg-gray-100"
			>
				{data.user.name}
				<ChevronDownIcon class="size-4" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Portal>
				<DropdownMenu.Content
					sideOffset={4}
					alignOffset={4}
					align="end"
					class="rounded-xl border border-gray-200 bg-white p-2 shadow"
				>
					<a
						href="/app/company"
						class="flex w-full items-center gap-2 rounded-md px-3 py-1 hover:bg-gray-100"
					>
						<BuildingIcon class="size-4" /> Manage company
					</a>
					<a
						href="/app/account"
						class="flex w-full items-center gap-2 rounded-md px-3 py-1 hover:bg-gray-100"
					>
						<UsersIcon class="size-4" /> My account
					</a>
					<Separator class="my-2" />
					<button
						class="flex w-full items-center gap-2 rounded-md px-3 py-1 hover:bg-gray-100"
						onclick={handleSignOut}
					>
						<LogOutIcon class="size-4" /> Log out
					</button>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	</div>
	{#if isOpen}
		<nav class="px-2">
			{#each pages as page}
				<NavItem href={page.href} icon={page.icon}>{page.title}</NavItem>
			{/each}
		</nav>
	{/if}
	<div
		class={[
			'flex flex-col gap-6 border-t border-l border-border p-8',
			!isOpen && 'col-span-2',
			isOpen && 'rounded-tl-md',
		]}
	>
		{@render children?.()}
	</div>
</div>

<form bind:this={signoutForm} method="POST" action="/app?/signout" class="hidden"></form>
