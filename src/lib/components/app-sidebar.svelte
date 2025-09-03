<script lang="ts">
	import NavUser from './nav-user.svelte';
	import NavThings from './nav-things.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import { authClient } from '$lib/auth-client';

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();

</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavThings />
	</Sidebar.Content>
	<Sidebar.Footer>
	</Sidebar.Footer>
	<Sidebar.Rail />
</Sidebar.Root>
