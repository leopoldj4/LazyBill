<script lang="ts">
	import Logo from '$lib/assets/logo.png';
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import * as Command from '$lib/components/ui/command';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import {
		BuildingIcon,
		ChevronDownIcon,
		LogOutIcon,
		SearchIcon
	} from '@lucide/svelte';
	import UsersIcon from '@lucide/svelte/icons/users';
	import { DropdownMenu } from 'bits-ui';

	const { children, data } = $props();

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
</script>

<Command.Dialog bind:open={commandOpen}>
	<Command.Input placeholder="Type a command or search..." />
	<Command.List>
		<Command.Empty>Keine Ergebnisse gefunden.</Command.Empty>
		<Command.Group heading="Seiten">
				<Command.LinkItem href="/app/customers" onclick={closeCommand}
					><UsersIcon /> Kunden</Command.LinkItem
				>
		</Command.Group>
		<Command.Separator />
		<Command.Group heading="Kunden">
			{#each data.customers as customer}
				<Command.LinkItem href={`/app/customers/${customer.id}`} onclick={closeCommand}
					><UsersIcon /> {customer.name}</Command.LinkItem
				>
			{/each}
		</Command.Group>
		<Command.Group heading="Einstellungen">
			<Command.LinkItem href="/app/company" onclick={closeCommand}
				><BuildingIcon /> Firma verwalten</Command.LinkItem
			>
			<Command.LinkItem href="/app/account" onclick={closeCommand}
				><UsersIcon /> Mein Konto</Command.LinkItem
			>
		</Command.Group>
	</Command.List>
</Command.Dialog>

<div class="h-screen">
	<div class="flex flex-row items-center justify-between w-full h-[52px] px-4">
		<header class="flex items-center gap-2 pr-2">
			<a class="flex items-center gap-1 shrink-0 mr-4" href="/app">
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

			<a class={buttonVariants({ variant: 'ghost' })} href="/app/customers">Kunden</a>
		</header>
		<div class="flex items-center justify-between">
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
