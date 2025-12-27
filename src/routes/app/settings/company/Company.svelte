<script lang="ts">
	import { goto } from '$app/navigation';
	import { api } from '$convex/_generated/api.js';
	import type { Doc } from '$convex/_generated/dataModel';
	import { debounce as debounceFn } from '$lib';
	import { authClient } from '$lib/auth-client';
	import Button from '$lib/components/ui/button/button.svelte';
	import LogOutIcon from '@lucide/svelte/icons/log-out';
	import { useConvexClient } from 'convex-svelte';
	import Row from './Row.svelte';
	import Section from './Section.svelte';
	const client = useConvexClient();

	type Props = {
		company: Doc<'companies'>;
	};

	let { company }: Props = $props();

	let name = $state('');
	let phone = $state('');
	let street = $state('');
	let zip = $state('');
	let city = $state('');
	let stateValue = $state('');
	let country = $state('');
	let representative = $state('');
	let bankName = $state('');
	let bankIban = $state('');
	let bankBic = $state('');
	let taxNumber = $state('');
	let smallBusiness = $state(false);

	let isInitial = true;
	let syncTimer: ReturnType<typeof setTimeout> | null = null;

	const syncFromCompany = () => {
		name = company.name;
		phone = company.phone;
		street = company.street;
		zip = company.zip;
		city = company.city;
		stateValue = company.state;
		country = company.country;
		representative = company.representative;
		bankName = company.bankName;
		bankIban = company.bankIban;
		bankBic = company.bankBic;
		taxNumber = company.taxNumber;
		smallBusiness = company.smallBusiness;
	};

	$effect(() => {
		company;
		if (isInitial) {
			isInitial = false;
			syncFromCompany();
		} else {
			if (syncTimer) clearTimeout(syncTimer);
			syncTimer = setTimeout(syncFromCompany, 3000);
		}
	});

	const debounce = debounceFn(
		async (values: typeof api.companies.update._args) => {
			await client.mutation(api.companies.update, values);
		},
		() => syncTimer && clearTimeout(syncTimer),
	);

	$effect(() => {
		debounce({
			name,
			phone,
			street,
			zip,
			city,
			state: stateValue,
			country,
			representative,
			bankName,
			bankIban,
			bankBic,
			smallBusiness,
			taxNumber,
		});
	});
</script>

<div class="my-12 flex flex-col gap-20">
	<Section title="Basisdaten">
		<Row label="Name" bind:value={name} />
		<Row label="Telefon" bind:value={phone} />
	</Section>

	<Section title="Adresse">
		<Row label="Straße" bind:value={street} />

		<Row label="PLZ" bind:value={zip} />

		<Row label="Stadt" bind:value={city} />

		<Row label="Bundesland" bind:value={stateValue} />

		<Row label="Land" bind:value={country} />
	</Section>

	<Section title="Bankdaten">
		<Row label="Vertreter" bind:value={representative} />

		<Row label="Bankname" bind:value={bankName} />

		<Row label="IBAN" bind:value={bankIban} />

		<Row label="BIC" bind:value={bankBic} />
	</Section>

	<Section title="Steuerliche Angaben">
		<Row label="Steuer-Nr." bind:value={taxNumber} />
		<Row label="Kleinunternehmer" bind:value={smallBusiness} checkbox />
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
