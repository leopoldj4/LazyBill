<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$convex/_generated/api.js';
	import type { Doc } from '$convex/_generated/dataModel';
	import { createDebouncedStore } from '$lib/debounce.svelte';
	import { authClient } from '$lib/auth-client';
	import Button from '$lib/components/ui/button/button.svelte';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import { useConvexClient } from 'convex-svelte';
	import Row from './Row.svelte';
	import Section from './Section.svelte';
	import { extractCompanyData, type CompanyData } from './company';
	const client = useConvexClient();

	type Props = {
		company: Doc<'companies'>;
	};

	let { company }: Props = $props();

	const store = createDebouncedStore<CompanyData>(
		extractCompanyData(company),
		async (values) => {
			await client.mutation(api.companies.update, values);
		},
		() => {
			// Reload from the company prop
			store.setWithoutSave(extractCompanyData(company));
		},
	);

	let isInitialMount = true;
	$effect(() => {
		company;
		if (isInitialMount) {
			isInitialMount = false;
			return;
		}
		store.reload();
	});
</script>

<div class="my-12 flex flex-col gap-20">
	<Section title="Basisdaten">
		<Row label="Name" bind:value={store.value.name} />
		<Row label="Telefon" bind:value={store.value.phone} />
	</Section>

	<Section title="Adresse">
		<Row label="Straße" bind:value={store.value.street} />

		<Row label="PLZ" bind:value={store.value.zip} />

		<Row label="Stadt" bind:value={store.value.city} />

		<Row label="Bundesland" bind:value={store.value.state} />

		<Row label="Land" bind:value={store.value.country} />
	</Section>

	<Section title="Bankdaten">
		<Row label="Vertreter" bind:value={store.value.representative} />

		<Row label="Bankname" bind:value={store.value.bankName} />

		<Row label="IBAN" bind:value={store.value.bankIban} />

		<Row label="BIC" bind:value={store.value.bankBic} />
	</Section>

	<Section title="Steuerliche Angaben">
		<Row label="Steuer-Nr." bind:value={store.value.taxNumber} />
		<Row label="Kleinunternehmer" bind:value={store.value.smallBusiness} checkbox />
	</Section>
</div>

<Button
	variant="link"
	class="mt-12"
	onclick={async () => {
		authClient.signOut();
		await goto('/login');
	}}
>
	<LogOutIcon class="size-4" />
	Abmelden
</Button>
