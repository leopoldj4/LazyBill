<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import Section from '../Section.svelte';
	import Address from '$lib/components/Address.svelte';
	import AddressModal from '$lib/components/AddressModal.svelte';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api';
	import type { Id } from '$convex/_generated/dataModel';
	import Suspense from '$lib/components/Suspense.svelte';

	let { data } = $props();
	const query = useQuery(api.companies.get, { id: data.companyId as Id<'companies'> });
	const client = useConvexClient();
</script>

<Suspense {query}>
	{#snippet children(company)}
		<Section title="Adresse">
			<div class="col-span-2 flex flex-col gap-2">
				<Address address={company} />
				<div>
					<AddressModal
						address={company}
						class="w-auto"
						onSave={async (address) => {
							await client.mutation(api.companies.updateAddress, { id: company._id, ...address });
						}}
					/>
				</div>
			</div>
		</Section>
	{/snippet}
</Suspense>
