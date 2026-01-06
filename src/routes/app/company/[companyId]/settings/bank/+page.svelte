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
		<Section title="Bankdaten">
			<Row
				label="Vertreter"
				key="representative"
				value={company.representative}
				placeholder="Max Mustermann"
				companyId={company._id}
			/>

			<Row
				label="Bankname"
				key="bankName"
				value={company.bankName}
				placeholder="Deutsche Bank"
				companyId={company._id}
			/>

			<Row
				label="IBAN"
				key="bankIban"
				value={company.bankIban}
				placeholder="DE12 3456 7890 1234 5678 90"
				iban
				companyId={company._id}
			/>

			<Row
				label="BIC"
				key="bankBic"
				value={company.bankBic}
				placeholder="DEUTDEDB123"
				companyId={company._id}
			/>
		</Section>
	{/snippet}
</Suspense>
