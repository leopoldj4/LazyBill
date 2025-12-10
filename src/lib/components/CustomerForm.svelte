<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { Textarea } from '$lib/components/ui/textarea/';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Field from '$lib/components/ui/field/';
	import AddressInput, { type ParsedAddress } from '$lib/components/AddressInput.svelte';

	export type CustomerFormData = {
		name: string;

		email: string;
		phone: string;
		notes: string;
		invoiceCountry: string;
		invoiceState: string;
		invoiceCity: string;
		invoiceStreet: string;
		invoiceStreetExtra: string;
		invoiceZip: string;
	};

	type Props = {
		form: CustomerFormData;
		onchange?: (form: CustomerFormData) => void;
	};

	let {
		form = $bindable(),
		onchange
	}: Props = $props();

	function handleAddressSelect(address: ParsedAddress) {
		const streetWithNumber = address.houseNumber 
			? `${address.street} ${address.houseNumber}` 
			: address.street;
		
		form.invoiceStreet = streetWithNumber;
		form.invoiceCity = address.city;
		form.invoiceState = address.state;
		form.invoiceZip = address.postalCode;
		form.invoiceCountry = address.country;
		
		onchange?.(form);
	}

	function handleFieldChange() {
		onchange?.(form);
	}
</script>

<div class="flex flex-col gap-8">
	<div class="grid grid-cols-[12rem_1fr] gap-4">
		<h2 class="text-lg font-bold">Basisdaten</h2>
		<div class="grid grid-cols-2 gap-x-8 gap-y-6">
			<Field.Field>
				<Field.Label for="name">Kundenname</Field.Label>
				<Input 
					name="name" 
					id="name" 
					autocomplete="off" 
					placeholder="Tiger GmbH" 
					bind:value={form.name} 
					oninput={handleFieldChange}
					required 
				/>
			</Field.Field>
			<Field.Field class="row-span-2 col-start-2">
				<Field.Label for="notes">Notizen</Field.Label>
				<Textarea
					name="notes"
					id="notes"
					autocomplete="off"
					placeholder="Interne Notizen zum Kunden..."
					bind:value={form.notes}
					oninput={handleFieldChange}
				/>
			</Field.Field>
			<Field.Field>
				<Field.Label for="phone">Telefon</Field.Label>
				<Input
					name="phone"
					id="phone"
					autocomplete="off"
					placeholder="+49 123 456789"
					bind:value={form.phone}
					oninput={handleFieldChange}
				/>
			</Field.Field>
			<Field.Field>
				<Field.Label for="email">Email</Field.Label>
				<Input
					name="email"
					id="email"
					autocomplete="off"
					placeholder="max.mustermann@tiger.de"
					bind:value={form.email}
					oninput={handleFieldChange}
				/>
			</Field.Field>
			
		</div>
	</div>

	<div class="grid grid-cols-[12rem_1fr] gap-4">
		<h2 class="text-lg font-bold">Adresse</h2>
		<div class="flex flex-col gap-6">
			
			<Field.Field>
				<Field.Label>Adresse suchen</Field.Label>
				<AddressInput onAddressSelect={handleAddressSelect} placeholder="Adresse suchen..." />
			</Field.Field>

			<Separator />

			<div class="grid grid-cols-2 gap-x-8 gap-y-6">
				<Field.Field>
					<Field.Label for="invoiceStreet">Adresse</Field.Label>
					<Input
						name="invoiceStreet"
						id="invoiceStreet"
						autocomplete="off"
						placeholder="Müllerstraße 1"
						bind:value={form.invoiceStreet}
						oninput={handleFieldChange}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="invoiceStreetExtra">Adresszusatz</Field.Label>
					<Input
						name="invoiceStreetExtra"
						id="invoiceStreetExtra"
						autocomplete="off"
						placeholder="Hinterhof"
						bind:value={form.invoiceStreetExtra}
						oninput={handleFieldChange}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="invoiceZip">PLZ</Field.Label>
					<Input
						name="invoiceZip"
						id="invoiceZip"
						autocomplete="off"
						placeholder="80331"
						bind:value={form.invoiceZip}
						oninput={handleFieldChange}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="invoiceCity">Stadt</Field.Label>
					<Input
						name="invoiceCity"
						id="invoiceCity"
						autocomplete="off"
						placeholder="München"
						bind:value={form.invoiceCity}
						oninput={handleFieldChange}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="invoiceState">Bundesland</Field.Label>
					<Input
						name="invoiceState"
						id="invoiceState"
						autocomplete="off"
						placeholder="Bayern"
						bind:value={form.invoiceState}
						oninput={handleFieldChange}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="invoiceCountry">Land</Field.Label>
					<Input
						name="invoiceCountry"
						id="invoiceCountry"
						autocomplete="off"
						placeholder="Deutschland"
						bind:value={form.invoiceCountry}
						oninput={handleFieldChange}
					/>
				</Field.Field>
			</div>
		</div>
	</div>
</div>

