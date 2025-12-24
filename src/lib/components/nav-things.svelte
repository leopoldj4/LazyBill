<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import UsersIcon from '@lucide/svelte/icons/users';
	import ClockIcon from '@lucide/svelte/icons/clock';
	import InvoiceIcon from '@lucide/svelte/icons/file-text';

	const items = [
		{
			title: 'Customers',
			url: '/app/customers',
			icon: UsersIcon,
		},
		{
			title: 'Time Tracking',
			url: '/app/time-tracking',
			icon: ClockIcon,
		},
		{
			title: 'Invoices',
			url: '/app/invoices',
			icon: InvoiceIcon,
		},
	];
</script>

<Sidebar.Group>
	<Sidebar.Menu>
		{#each items as item (item.title)}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						<a href={item.url} {...props}><item.icon />{item.title}</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
