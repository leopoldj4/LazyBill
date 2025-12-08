<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Field from '$lib/components/ui/field/';
	import AddressInput, { type ParsedAddress } from '$lib/components/AddressInput.svelte';

	export type CustomerFormData = {
		name: string;
		representative: string;
		email: string;
		phone: string;
		invoiceName: string;
		invoiceCountry: string;
		invoiceState: string;
		invoiceCity: string;
		invoiceStreet: string;
		invoicePhone: string;
		invoiceStreetExtra: string;
		invoiceZip: string;
	};

	type Props = {
		form: CustomerFormData;
		/** 
		 * Mode determines behavior:
		 * - 'create': Auto-syncs invoice name/phone with basic info unless manually edited
		 * - 'edit': No auto-sync, all fields are independent
		 */
		mode?: 'create' | 'edit';
		/** Called when any form field changes */
		onchange?: (form: CustomerFormData) => void;
	};

	let {
		form = $bindable(),
		mode = 'create',
		onchange
	}: Props = $props();

	// Track if invoice fields have been manually edited (only relevant in create mode)
	let invoiceNameManuallyEdited = $state(false);
	let invoicePhoneManuallyEdited = $state(false);

	// Sync invoice name with representative unless manually edited (only in create mode)
	$effect(() => {
		if (mode === 'create' && !invoiceNameManuallyEdited) {
			form.invoiceName = form.representative;
		}
	});

	// Sync invoice phone with customer phone unless manually edited (only in create mode)
	$effect(() => {
		if (mode === 'create' && !invoicePhoneManuallyEdited) {
			form.invoicePhone = form.phone;
		}
	});

	function handleAddressSelect(address: ParsedAddress) {
		// Combine street and house number for the street field
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
			<Field.Field>
				<Field.Label for="representative">Ansprechpartner</Field.Label>
				<Input
					name="representative"
					id="representative"
					autocomplete="off"
					placeholder="Max Mustermann"
					bind:value={form.representative}
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
			<Field.Field>
				<Field.Label for="phone">Telefon</Field.Label>
				<Input 
					name="phone" 
					id="phone" 
					autocomplete="off" 
					placeholder="0123456789" 
					bind:value={form.phone}
					oninput={handleFieldChange}
				/>
			</Field.Field>
		</div>
	</div>

	<div class="grid grid-cols-[12rem_1fr] gap-4">
		<h2 class="text-lg font-bold">Rechnungsadresse</h2>
		<div class="flex flex-col gap-6">
			<div class="grid grid-cols-2 gap-x-8 gap-y-6">
				<Field.Field>
					<Field.Label for="invoiceName">Name</Field.Label>
					<Input
						name="invoiceName"
						id="invoiceName"
						autocomplete="off"
						placeholder="Tiger GmbH"
						bind:value={form.invoiceName}
						oninput={() => {
							if (mode === 'create') invoiceNameManuallyEdited = true;
							handleFieldChange();
						}}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="invoicePhone">Telefon</Field.Label>
					<Input
						name="invoicePhone"
						id="invoicePhone"
						autocomplete="off"
						placeholder="0123456789"
						bind:value={form.invoicePhone}
						oninput={() => {
							if (mode === 'create') invoicePhoneManuallyEdited = true;
							handleFieldChange();
						}}
					/>
				</Field.Field>
			</div>

			<Separator />

			<Field.Field>
				<Field.Label>Adresse suchen</Field.Label>
				<AddressInput onAddressSelect={handleAddressSelect} placeholder="Adresse suchen..." />
			</Field.Field>
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

