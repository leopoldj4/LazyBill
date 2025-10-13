<script lang="ts">
	import NavUser from './nav-user.svelte';
	import NavThings from './nav-things.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { authClient } from '$lib/auth-client';
	import logo from '$lib/assets/logo.svg';
	import type { SidebarUser } from './sidebar-user';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		user,
		...restProps
	}: ComponentProps<typeof Sidebar.Root> & { user: SidebarUser } = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<img src={logo} alt="Kirei" class="mx-auto mt-3 h-6 w-6" />
		<h1 class="p-3 text-center text-2xl font-bold">Kirei</h1>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavThings />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
