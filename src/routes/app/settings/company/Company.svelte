<script lang="ts">
	import type { Doc } from '$convex/_generated/dataModel';
	import { debounce as debounceFn } from '$lib';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { api } from '$convex/_generated/api.js';
	import { useConvexClient } from 'convex-svelte';

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
			syncTimer = setTimeout(syncFromCompany, 5000);
		}
	});

	const debounce = debounceFn(async (values: typeof api.companies.update._args) => {
		await client.mutation(api.companies.update, values);
	});

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
	<div class="grid grid-cols-1 gap-12 md:grid-cols-[16rem_1fr]">
		<h2 class="text-right text-xl">Basisdaten</h2>
		<div class="grid grid-cols-[24rem_24rem] gap-x-16 gap-y-8">
			<div class="grid grid-cols-[6rem_14rem] gap-4">
				<Label for="name" class="justify-self-end">Name</Label>
				<Input type="text" id="name" bind:value={name} />
			</div>

			<div class="grid grid-cols-[6rem_14rem] gap-4">
				<Label for="phone" class="justify-self-end">Telefon</Label>
				<Input type="text" id="phone" bind:value={phone} />
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-12 md:grid-cols-[16rem_1fr]">
		<h2 class="text-right text-xl">Adresse</h2>
		<div class="grid grid-cols-[24rem_24rem] gap-x-16 gap-y-8">
			<div class="grid grid-cols-[6rem_14rem] gap-4">
				<Label for="street" class="justify-self-end">Straße</Label>
				<Input type="text" id="street" bind:value={street} />
			</div>

			<div class="grid grid-cols-[6rem_14rem] gap-4">
				<Label for="zip" class="justify-self-end">PLZ</Label>
				<Input type="text" id="zip" bind:value={zip} />
			</div>

			<div class="grid grid-cols-[6rem_14rem] gap-4">
				<Label for="city" class="justify-self-end">Stadt</Label>
				<Input type="text" id="city" bind:value={city} />
			</div>

			<div class="grid grid-cols-[6rem_14rem] gap-4">
				<Label for="state" class="justify-self-end">Bundesland</Label>
				<Input type="text" id="state" bind:value={stateValue} />
			</div>

			<div class="grid grid-cols-[6rem_14rem] gap-4">
				<Label for="country" class="justify-self-end">Land</Label>
				<Input type="text" id="country" bind:value={country} />
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-12 md:grid-cols-[16rem_1fr]">
		<h2 class="text-right text-xl">Bankdaten</h2>
		<div class="grid grid-cols-[24rem_24rem] gap-x-16 gap-y-8">
			<div class="grid grid-cols-[6rem_14rem] gap-4">
				<Label for="representative" class="justify-self-end">Vertreter</Label>
				<Input type="text" id="representative" bind:value={representative} />
			</div>

			<div class="grid grid-cols-[6rem_14rem] gap-4">
				<Label for="bankName" class="justify-self-end">Bankname</Label>
				<Input type="text" id="bankName" bind:value={bankName} />
			</div>

			<div class="grid grid-cols-[6rem_14rem] gap-4">
				<Label for="bankIban" class="justify-self-end">IBAN</Label>
				<Input type="text" id="bankIban" bind:value={bankIban} />
			</div>

			<div class="grid grid-cols-[6rem_14rem] gap-4">
				<Label for="bankBic" class="justify-self-end">BIC</Label>
				<Input type="text" id="bankBic" bind:value={bankBic} />
			</div>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-12 md:grid-cols-[16rem_1fr]">
		<h2 class="text-right text-xl">Steuerliche Angaben</h2>
		<div class="grid grid-cols-[24rem_24rem] gap-x-16 gap-y-8">
			<div class="grid grid-cols-[6rem_14rem] gap-4">
				<Label for="taxNumber" class="justify-self-end">Steuer-Nr.</Label>
				<Input type="text" id="taxNumber" bind:value={taxNumber} />
			</div>
			<div class="grid grid-cols-[6rem_14rem] items-center gap-4">
				<Label for="smallBusiness" class="justify-self-end">Kleinunternehmer</Label>
				<Checkbox id="smallBusiness" bind:checked={smallBusiness} />
			</div>
		</div>
	</div>
</div>
