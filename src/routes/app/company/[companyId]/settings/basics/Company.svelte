<script lang="ts">
	import { api } from '$convex/_generated/api.js';
	import type { Doc } from '$convex/_generated/dataModel';
	import Address from '$lib/components/Address.svelte';
	import AddressModal from '$lib/components/AddressModal.svelte';
	import { useConvexClient } from 'convex-svelte';
	import Row from '../Row.svelte';
	import Section from '../Section.svelte';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import { prompt } from '$lib/prompt.svelte';

	const client = useConvexClient();

	type Props = {
		company: Doc<'companies'>;
	};

	let { company }: Props = $props();
</script>

<div class="flex flex-col gap-20">
	<Section title="Basisdaten">
		<Row
			label="Name"
			key="name"
			value={company.name}
			placeholder="Test GmbH"
			companyId={company._id}
		/>
		<Row
			label="Telefon"
			key="phone"
			value={company.phone}
			placeholder="+49 123 4567890"
			companyId={company._id}
		/>
	</Section>

	<Section title="Gefährliche Zone">
		<div>
			<Button
				variant="destructive"
				onclick={async () => {
					if (
						!(await prompt('Löschen', 'Sind Sie sicher, dass Sie diese Firma löschen möchten? Das kann nicht rückgängig gemacht werden.'))
					) {
						return;
					}
					await client.mutation(api.companies.remove, { id: company._id });
					goto('/app');
				}}
			>
				Firma löschen
			</Button>
		</div>
	</Section>
</div>
