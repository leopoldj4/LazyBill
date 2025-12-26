<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api.js';
	import { debounce } from '$lib';
	import Suspense from '$lib/components/Suspense.svelte';

	const client = useConvexClient();
	const query = useQuery(api.companies.get, {});

	async function updateValue(key: string, event: Event) {
		await client.mutation(api.companies.update, {
			key: key,
			value: (event.target as HTMLInputElement).value,
		});
	}

	const updateName = debounce((event: Event) => updateValue('name', event));
	const updatePhone = debounce((event: Event) => updateValue('phone', event));
	const updateStreet = debounce((event: Event) => updateValue('street', event));
	const updateZip = debounce((event: Event) => updateValue('zip', event));
	const updateCity = debounce((event: Event) => updateValue('city', event));
	const updateState = debounce((event: Event) => updateValue('state', event));
	const updateCountry = debounce((event: Event) => updateValue('country', event));
	const updateRepresentative = debounce((event: Event) => updateValue('representative', event));
	const updateBankName = debounce((event: Event) => updateValue('bankName', event));
	const updateBankIban = debounce((event: Event) => updateValue('bankIban', event));
	const updateBankBic = debounce((event: Event) => updateValue('bankBic', event));
	const updateTaxNumber = debounce((event: Event) => updateValue('taxNumber', event));

	const updateSmallBusiness = debounce(async (checked: boolean) => {
		await client.mutation(api.companies.update, {
			key: 'smallBusiness',
			value: checked ? 'true' : 'false',
		});
	});
</script>

<Suspense {query}>
	{#snippet children(data)}
		{@const company = query.data!}
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/app/settings">Einstellungen</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>Meine Firma</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<SiteHeader>Meine Firma</SiteHeader>

		<div class="my-12 flex flex-col gap-20">
			<div class="grid grid-cols-1 gap-12 md:grid-cols-[16rem_1fr]">
				<h2 class="text-right text-xl">Basisdaten</h2>
				<div class="grid grid-cols-[24rem_24rem] gap-x-16 gap-y-8">
					<div class="grid grid-cols-[6rem_14rem] gap-4">
						<Label for="name" class="justify-self-end">Name</Label>
						<Input
							type="text"
							id="name"
							value={company.name}
							oninput={updateName}
							onkeydown={updateName}
						/>
					</div>

					<div class="grid grid-cols-[6rem_14rem] gap-4">
						<Label for="phone" class="justify-self-end">Telefon</Label>
						<Input
							type="text"
							id="phone"
							value={company.phone}
							oninput={updatePhone}
							onkeydown={updatePhone}
						/>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-12 md:grid-cols-[16rem_1fr]">
				<h2 class="text-right text-xl">Adresse</h2>
				<div class="grid grid-cols-[24rem_24rem] gap-x-16 gap-y-8">
					<div class="grid grid-cols-[6rem_14rem] gap-4">
						<Label for="street" class="justify-self-end">Straße</Label>
						<Input
							type="text"
							id="street"
							value={company.street}
							oninput={updateStreet}
							onkeydown={updateStreet}
						/>
					</div>

					<div class="grid grid-cols-[6rem_14rem] gap-4">
						<Label for="zip" class="justify-self-end">PLZ</Label>
						<Input
							type="text"
							id="zip"
							value={company.zip}
							oninput={updateZip}
							onkeydown={updateZip}
						/>
					</div>

					<div class="grid grid-cols-[6rem_14rem] gap-4">
						<Label for="city" class="justify-self-end">Stadt</Label>
						<Input
							type="text"
							id="city"
							value={company.city}
							oninput={updateCity}
							onkeydown={updateCity}
						/>
					</div>

					<div class="grid grid-cols-[6rem_14rem] gap-4">
						<Label for="state" class="justify-self-end">Bundesland</Label>
						<Input
							type="text"
							id="state"
							value={company.state}
							oninput={updateState}
							onkeydown={updateState}
						/>
					</div>

					<div class="grid grid-cols-[6rem_14rem] gap-4">
						<Label for="country" class="justify-self-end">Land</Label>
						<Input
							type="text"
							id="country"
							value={company.country}
							oninput={updateCountry}
							onkeydown={updateCountry}
						/>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-12 md:grid-cols-[16rem_1fr]">
				<h2 class="text-right text-xl">Bankdaten</h2>
				<div class="grid grid-cols-[24rem_24rem] gap-x-16 gap-y-8">
					<div class="grid grid-cols-[6rem_14rem] gap-4">
						<Label for="representative" class="justify-self-end">Vertreter</Label>
						<Input
							type="text"
							id="representative"
							value={company.representative}
							oninput={updateRepresentative}
							onkeydown={updateRepresentative}
						/>
					</div>

					<div class="grid grid-cols-[6rem_14rem] gap-4">
						<Label for="bankName" class="justify-self-end">Bankname</Label>
						<Input
							type="text"
							id="bankName"
							value={company.bankName}
							oninput={updateBankName}
							onkeydown={updateBankName}
						/>
					</div>

					<div class="grid grid-cols-[6rem_14rem] gap-4">
						<Label for="bankIban" class="justify-self-end">IBAN</Label>
						<Input
							type="text"
							id="bankIban"
							value={company.bankIban}
							oninput={updateBankIban}
							onkeydown={updateBankIban}
						/>
					</div>

					<div class="grid grid-cols-[6rem_14rem] gap-4">
						<Label for="bankBic" class="justify-self-end">BIC</Label>
						<Input
							type="text"
							id="bankBic"
							value={company.bankBic}
							oninput={updateBankBic}
							onkeydown={updateBankBic}
						/>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-12 md:grid-cols-[16rem_1fr]">
				<h2 class="text-right text-xl">Steuerliche Angaben</h2>
				<div class="grid grid-cols-[24rem_24rem] gap-x-16 gap-y-8">
					<div class="grid grid-cols-[6rem_14rem] gap-4">
						<Label for="taxNumber" class="justify-self-end">Steuer-Nr.</Label>
						<Input
							type="text"
							id="taxNumber"
							value={company.taxNumber}
							oninput={updateTaxNumber}
							onkeydown={updateTaxNumber}
						/>
					</div>
					<div class="grid grid-cols-[6rem_14rem] items-center gap-4">
						<Label for="smallBusiness" class="justify-self-end">Kleinunternehmer</Label>
						<Checkbox
							id="smallBusiness"
							checked={company.smallBusiness}
							onCheckedChange={updateSmallBusiness}
						/>
					</div>
				</div>
			</div>
		</div>
	{/snippet}
</Suspense>
