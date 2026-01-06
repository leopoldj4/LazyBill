<script lang="ts">
	import Section from '../Section.svelte';
	import Row from '../Row.svelte';
	import { useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api';
	import type { Id } from '$convex/_generated/dataModel';
	import Suspense from '$lib/components/Suspense.svelte';

	let { data } = $props();
	const query = useQuery(api.companies.get, { id: data.companyId as Id<'companies'> });
</script>

<Suspense {query}>
	{#snippet children(company)}
		<Section title="Steuerliche Angaben">
			<Row
				label="Steuer-Nr."
				key="taxNumber"
				value={company.taxNumber}
				placeholder="1234567890"
				companyId={company._id}
			/>
			<Row
				label="Kleinunternehmer"
				key="smallBusiness"
				value={company.smallBusiness}
				checkbox
				companyId={company._id}
			/>
		</Section>
	{/snippet}
</Suspense>
