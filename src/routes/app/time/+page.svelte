<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import SiteHeader from '$lib/components/site-header.svelte';
    import * as Select from '$lib/components/ui/select';
    import { useQuery } from 'convex-svelte';
    import { api } from '$convex/_generated/api';
    import type { Doc, Id } from '$convex/_generated/dataModel';
	import Input from '$lib/components/ui/input/input.svelte';

    const customersQuery = useQuery(api.customers.list, {});

    let customerId = $state<Id<'customers'> | undefined>(undefined);

    type Customer = Doc<'customers'>;

    let customers: Customer[] = $derived(customersQuery.data ?? []);
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>Zeiterfassung</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<SiteHeader>Zeiterfassung</SiteHeader>

<Select.Root type="single" bind:value={customerId}>
    <Select.Trigger class="w-full">
        {customerId
            ? customers.find((customer) => customer._id === customerId)?.name
            : 'Kein Kunde ausgewählt'}
    </Select.Trigger>
    <Select.Content>
        <Select.Item value="">Kein Kunde</Select.Item>
        <Select.Separator />
        {#each customers as customer}
            <Select.Item value={customer._id}>{customer.name}</Select.Item>
        {/each}
    </Select.Content>
</Select.Root>