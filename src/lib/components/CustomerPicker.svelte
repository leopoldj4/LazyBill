<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { Doc, Id } from '$convex/_generated/dataModel';
	import { useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api';

	
	let {
		customerId = $bindable(),
		class: className,
		companyId,
	}: {
		customerId?: Id<'customers'>;
		class?: string;
		companyId: Id<'companies'>;
	} = $props();
	const query = useQuery(api.customers.list, () => ({ companyId }));
</script>

<Select.Root type="single" bind:value={customerId}>
	<Select.Trigger class="w-full {className}" size="sm">
		{customerId ? query.data?.find((c) => c._id === customerId)?.name : 'Kein Kunde'}
	</Select.Trigger>
	<Select.Content>
		<Select.Item value="">Kein Kunde</Select.Item>
		<Select.Separator />
		{#each query.data as customer}
			<Select.Item value={customer._id}>{customer.name}</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
