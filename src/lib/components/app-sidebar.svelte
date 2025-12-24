<script lang="ts">
	import NavUser from './nav-user.svelte';
	import NavThings from './nav-things.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { authClient } from '$lib/auth-client';
	import logo from '$lib/assets/logo.svg';
	import type { SidebarUser } from './sidebar-user';
	import BuildingIcon from '@lucide/svelte/icons/building';
	import UserIcon from '@lucide/svelte/icons/user';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		user,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { user: SidebarUser } = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<a href="/app">
			<img src={logo} alt="Watchtower logo" class="mx-auto mt-3 h-6 w-6" />
			<h1 class="p-3 text-center text-2xl font-bold">Watchtower</h1>
		</a>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavThings />
	</Sidebar.Content>
	<Sidebar.Footer>
		<Sidebar.MenuItem>
			<Sidebar.MenuButton>
				{#snippet child({ props })}
					<a href="/app/company" {...props}><BuildingIcon />My Company</a>
				{/snippet}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
		<Sidebar.MenuItem>
			<Sidebar.MenuButton>
				{#snippet child({ props })}
					<a href="/app/account" {...props}>
						<UserIcon />
						Account Settings
					</a>
				{/snippet}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
		<Sidebar.Separator />
		<NavUser {user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
