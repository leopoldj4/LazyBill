<script lang="ts">
	import Path from '$lib/components/Path.svelte';
	import { useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api.js';
	import type { Id } from '$convex/_generated/dataModel.js';

	const { data, children } = $props();

	const query = useQuery(api.companies.getCompanies, {});
	const companyName = $derived(query.data?.find((company) => company._id === data.companyId)?.name || '');
</script>

<Path
	label={companyName}
	href="/app/company/{data.companyId}"
/>

{@render children?.()}
