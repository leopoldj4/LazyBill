<script lang="ts">
	import { api } from '$convex/_generated/api.js';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Suspense from '$lib/components/Suspense.svelte';
	import { useQuery } from 'convex-svelte';
	import Company from './Company.svelte';
	const query = useQuery(api.companies.get, {});
</script>

<SiteHeader>Meine Firma</SiteHeader>
<Suspense {query}>
	{#snippet children(company)}
		<Company {company} />
	{/snippet}
</Suspense>
