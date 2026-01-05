<script lang="ts">
	import { api } from '$convex/_generated/api.js';
	import type { Doc } from '$convex/_generated/dataModel';
	import { fromCompany } from '$lib/address';
	import Address from '$lib/components/Address.svelte';
	import AddressModal from '$lib/components/AddressModal.svelte';
	import { useConvexClient } from 'convex-svelte';
	import Row from './Row.svelte';
	import Section from './Section.svelte';
	const client = useConvexClient();

	type Props = {
		company: Doc<'companies'>;
	};

	let { company }: Props = $props();
</script>

<div class="my-12 flex flex-col gap-20">
	<Section title="Basisdaten">
		<Row label="Name" key="name" value={company.name} placeholder="Test GmbH" />
		<Row label="Telefon" key="phone" value={company.phone} placeholder="+49 123 4567890" />
	</Section>

	<Section title="Adresse">
		<div class="flex flex-col gap-2">
			<Address address={fromCompany(company)} />
			<AddressModal
				address={fromCompany(company)}
				onSave={async (address) => {
					await client.mutation(api.companies.updateAddress, address);
				}}
			/>
		</div>
	</Section>

	<Section title="Bankdaten">
		<Row
			label="Vertreter"
			key="representative"
			value={company.representative}
			placeholder="Max Mustermann"
		/>

		<Row label="Bankname" key="bankName" value={company.bankName} placeholder="Deutsche Bank" />

		<Row
			label="IBAN"
			key="bankIban"
			value={company.bankIban}
			placeholder="DE12 3456 7890 1234 5678 90"
			iban
		/>

		<Row label="BIC" key="bankBic" value={company.bankBic} placeholder="DEUTDEDB123" />
	</Section>

	<Section title="Steuerliche Angaben">
		<Row label="Steuer-Nr." key="taxNumber" value={company.taxNumber} placeholder="1234567890" />
		<Row label="Kleinunternehmer" key="smallBusiness" value={company.smallBusiness} checkbox />
	</Section>
</div>