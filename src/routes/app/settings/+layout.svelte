<script lang="ts">
	import { page } from '$app/state';
	import { api } from '$convex/_generated/api.js';
	import type { Icon } from '@lucide/svelte';
	import BanknoteIcon from '@lucide/svelte/icons/banknote';
	import BellIcon from '@lucide/svelte/icons/bell';
	import BuildingIcon from '@lucide/svelte/icons/building';
	import ReceiptIcon from '@lucide/svelte/icons/receipt';
	import RocketIcon from '@lucide/svelte/icons/rocket';
	import UserIcon from '@lucide/svelte/icons/user';
	import { useQuery } from 'convex-svelte';

	const currentUser = useQuery(api.auth.getCurrentUser, {});

	let { children } = $props();
</script>

{#snippet navLink(href: string, IconValue: typeof Icon, label: string)}
	<a
		{href}
		class={[
			'flex flex-row items-center gap-2 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-100',
			href === page.url.pathname ? 'text-black' : 'text-gray-500',
		]}
	>
		<IconValue class="size-4"></IconValue>
		{label}
	</a>
{/snippet}

<div class="flex flex-col gap-12 lg:grid lg:grid-cols-[16rem_1fr] min-h-[90vh]">
	<div class="flex flex-col pr-4 lg:border-r">
		<h2 class="mb-4 text-xl max-lg:hidden">Einstellungen</h2>
		{@render navLink('/app/settings/company', BuildingIcon, 'Meine Firma')}
		{@render navLink('/app/settings/bank', BanknoteIcon, 'Bank')}
		{@render navLink('/app/settings/notifications', BellIcon, 'Benachrichtigungen')}
		{@render navLink('/app/settings/invoices', ReceiptIcon, 'Rechnungen')}
		{@render navLink('/app/settings/account', UserIcon, 'Account')}
		{#if currentUser?.data?.email == 'mail@leoj.de'}
			{@render navLink('/app/settings/beta', RocketIcon, 'Beta')}
		{/if}
	</div>
	<div class="flex flex-col gap-8">
		{@render children?.()}
	</div>
</div>
