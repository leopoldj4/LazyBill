<script lang="ts">
	import Path from '$lib/components/Path.svelte';
	import { useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api.js';
	import type { Id } from '$convex/_generated/dataModel.js';

	const { data, children } = $props();

    const query = useQuery(api.customers.getFull, () => ({
        id: data.customerId as Id<'customers'>,
    }));
</script>

<Path label={query.data?.customer.name ?? ''} href="/app/company/{data.companyId}/customers/{data.customerId}" />

{@render children?.()}