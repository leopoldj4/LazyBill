<script lang="ts">
	import { api } from '$convex/_generated/api.js';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import BanknoteIcon from '@lucide/svelte/icons/banknote';
	import BellIcon from '@lucide/svelte/icons/bell';
	import BuildingIcon from '@lucide/svelte/icons/building';
	import ReceiptIcon from '@lucide/svelte/icons/receipt';
	import RocketIcon from '@lucide/svelte/icons/rocket';
	import UserIcon from '@lucide/svelte/icons/user';
	import { useQuery } from 'convex-svelte';

	const currentUser = useQuery(api.auth.getCurrentUser, {});

	let { children } = $props();

	const settingsNavLinks = [
		{ href: '/app/settings/company', icon: BuildingIcon, label: 'Meine Firma' },
		{ href: '/app/settings/bank', icon: BanknoteIcon, label: 'Bank' },
		{ href: '/app/settings/notifications', icon: BellIcon, label: 'Benachrichtigungen' },
		{ href: '/app/settings/invoices', icon: ReceiptIcon, label: 'Rechnungen' },
		{ href: '/app/settings/account', icon: UserIcon, label: 'Account' },
	];
</script>

<Sidebar.Provider>
	<Sidebar.Root class="top-[52px]">
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Einstellungen</Sidebar.GroupLabel>
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
					{#if currentUser?.data?.email == 'mail@leoj.de'}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href="/app/settings/beta" {...props}>
										<RocketIcon class="size-4" />
										Beta
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/if}
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>

	<div class="flex w-full flex-col gap-8">
		<Sidebar.Trigger />
		{@render children?.()}
	</div>
</Sidebar.Provider>
