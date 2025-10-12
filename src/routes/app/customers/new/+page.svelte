<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import SaveIcon from '@lucide/svelte/icons/save';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { superForm } from 'sveltekit-superforms';
	import * as Field from '$lib/components/ui/field/';

	const { data } = $props();

	let { form, enhance } = superForm(data.form);
</script>

<form method="post" class="flex flex-col gap-8">
	<div class="flex flex-row justify-between">
		<h1 class="text-2xl font-bold">New Customer</h1>
		<Button type="submit">
			<SaveIcon />
			Save Customer
		</Button>
	</div>

	<Separator />

	<div class="mt-4 grid grid-cols-[12rem_1fr] gap-4">
		<h2 class="text-lg font-bold">Basisdaten</h2>
		<div class="grid grid-cols-2 gap-x-8 gap-y-6">
			<Field.Field>
				<Field.Label for="name">Kundenname</Field.Label>
				<Input name="name" id="name" autocomplete="off" placeholder="Tiger GmbH" bind:value={$form.name} required />
			</Field.Field>
			<Field.Field>
				<Field.Label for="representative">Ansprechpartner</Field.Label>
				<Input
					name="representative"
					id="representative"
					autocomplete="off"
					placeholder="Max Mustermann"
					bind:value={$form.representative}
				/>
			</Field.Field>
			<Field.Field>
				<Field.Label for="email">Email</Field.Label>
				<Input
					name="email"
					id="email"
					autocomplete="off"
					placeholder="max.mustermann@tiger.de"
					bind:value={$form.email}
				/>
			</Field.Field>
			<Field.Field>
				<Field.Label for="phone">Telefon</Field.Label>
				<Input name="phone" id="phone" autocomplete="off" placeholder="0123456789" bind:value={$form.phone} />
			</Field.Field>
		</div>
	</div>

	<div class="mt-4 grid grid-cols-[12rem_1fr] gap-4">
		<h2 class="text-lg font-bold">Rechnungsadresse</h2>
		<div class="grid grid-cols-2 gap-x-8 gap-y-6">
			<Field.Field>
				<Field.Label for="invoiceName">Name</Field.Label>
				<Input
					name="invoiceName"
					id="invoiceName"
					autocomplete="off"
					placeholder="Tiger GmbH"
					bind:value={$form.invoiceName}
				/>
			</Field.Field>
			<Field.Field>
				<Field.Label for="invoiceCountry">Land</Field.Label>
				<Input
					name="invoiceCountry"
					id="invoiceCountry"
					autocomplete="off"
					placeholder="Deutschland"
					bind:value={$form.invoiceCountry}
				/>
			</Field.Field>
			<Field.Field>
				<Field.Label for="invoiceState">Bundesland</Field.Label>
				<Input
					name="invoiceState"
					id="invoiceState"
					autocomplete="off"
					placeholder="Bayern"
					bind:value={$form.invoiceState}
				/>
			</Field.Field>
			<Field.Field>
				<Field.Label for="invoiceCity">Stadt</Field.Label>
				<Input
					name="invoiceCity"
					id="invoiceCity"
					autocomplete="off"
					placeholder="München"
					bind:value={$form.invoiceCity}
				/>
			</Field.Field>
			<Field.Field>
				<Field.Label for="invoiceStreet">Adresse</Field.Label>
				<Input
					name="invoiceStreet"
					id="invoiceStreet"
					autocomplete="off"
					placeholder="Müllerstraße 1"
					bind:value={$form.invoiceStreet}
				/>
			</Field.Field>
			<Field.Field>
				<Field.Label for="invoicePhone">Telefon</Field.Label>
				<Input
					name="invoicePhone"
					id="invoicePhone"
					autocomplete="off"
					placeholder="0123456789"
					bind:value={$form.invoicePhone}
				/>
			</Field.Field>
			<Field.Field>
				<Field.Label for="invoiceStreetExtra">Adresszusatz</Field.Label>
				<Input
					name="invoiceStreetExtra"
					id="invoiceStreetExtra"
					autocomplete="off"
					placeholder="Hinterhof"
					bind:value={$form.invoiceStreetExtra}
				/>
			</Field.Field>
			<Field.Field>
				<Field.Label for="invoiceZip">PLZ</Field.Label>
				<Input
					name="invoiceZip"
					id="invoiceZip"
					autocomplete="off"
					placeholder="80331"
					bind:value={$form.invoiceZip}
				/>
			</Field.Field>
		</div>
	</div>
</form>
