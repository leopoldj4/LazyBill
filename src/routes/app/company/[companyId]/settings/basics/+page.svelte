<script lang="ts">
	import { api } from '$convex/_generated/api.js';
	import type { Id } from '$convex/_generated/dataModel.js';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Suspense from '$lib/components/Suspense.svelte';
	import { useQuery } from 'convex-svelte';
	import Company from './Company.svelte';
	
	let { data } = $props();
	const query = useQuery(api.companies.get, { id: data.companyId as Id<'companies'> });
</script>

<Suspense {query}>
	{#snippet children(company)}
		<Company {company} />
	{/snippet}
</Suspense>
