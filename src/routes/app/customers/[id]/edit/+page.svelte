<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import SaveIcon from '@lucide/svelte/icons/save';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { superForm } from 'sveltekit-superforms';
	import * as Field from '$lib/components/ui/field/';
	import { buttonVariants } from '$lib/components/ui/button';

	const { data } = $props();

	let { form, enhance } = superForm(data.form);
</script>

<div>
	<!-- Header with back button -->
	<div class="flex items-center justify-between mb-6">
		<div class="flex items-center gap-4">
			<a href="/app/customers/{data.customer.id}" class={buttonVariants({ variant: 'outline', size: 'sm' })}>
				<ArrowLeftIcon class="h-4 w-4" />
				Back to Customer
			</a>
			<h1 class="text-2xl font-bold">Edit Customer</h1>
		</div>
		<Button type="submit" form="edit-form">
			<SaveIcon />
			Save Changes
		</Button>
	</div>

	<Separator />

	<form id="edit-form" method="post" class="flex flex-col gap-8" use:enhance>
		<div class="mt-4 grid grid-cols-[12rem_1fr] gap-4">
			<h2 class="text-lg font-bold">Basic Information</h2>
			<div class="grid grid-cols-2 gap-x-8 gap-y-6">
				<Field.Field>
					<Field.Label for="name">Customer Name</Field.Label>
					<Input name="name" id="name" autocomplete="off" placeholder="Tiger GmbH" bind:value={$form.name} required />
				</Field.Field>
				<Field.Field>
					<Field.Label for="representative">Representative</Field.Label>
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
						type="email"
						autocomplete="off"
						placeholder="max.mustermann@tiger.de"
						bind:value={$form.email}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="phone">Phone</Field.Label>
					<Input name="phone" id="phone" autocomplete="off" placeholder="0123456789" bind:value={$form.phone} />
				</Field.Field>
			</div>
		</div>

		<div class="mt-4 grid grid-cols-[12rem_1fr] gap-4">
			<h2 class="text-lg font-bold">Invoice Address</h2>
			<div class="grid grid-cols-2 gap-x-8 gap-y-6">
				<Field.Field>
					<Field.Label for="invoiceName">Invoice Name</Field.Label>
					<Input
						name="invoiceName"
						id="invoiceName"
						autocomplete="off"
						placeholder="Tiger GmbH"
						bind:value={$form.invoiceName}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="invoiceStreet">Street</Field.Label>
					<Input
						name="invoiceStreet"
						id="invoiceStreet"
						autocomplete="off"
						placeholder="Müllerstraße 1"
						bind:value={$form.invoiceStreet}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="invoiceStreetExtra">Street Extra</Field.Label>
					<Input
						name="invoiceStreetExtra"
						id="invoiceStreetExtra"
						autocomplete="off"
						placeholder="Apt 2B"
						bind:value={$form.invoiceStreetExtra}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="invoiceCity">City</Field.Label>
					<Input
						name="invoiceCity"
						id="invoiceCity"
						autocomplete="off"
						placeholder="München"
						bind:value={$form.invoiceCity}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="invoiceState">State</Field.Label>
					<Input
						name="invoiceState"
						id="invoiceState"
						autocomplete="off"
						placeholder="Bayern"
						bind:value={$form.invoiceState}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="invoiceZip">ZIP Code</Field.Label>
					<Input
						name="invoiceZip"
						id="invoiceZip"
						autocomplete="off"
						placeholder="80331"
						bind:value={$form.invoiceZip}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="invoiceCountry">Country</Field.Label>
					<Input
						name="invoiceCountry"
						id="invoiceCountry"
						autocomplete="off"
						placeholder="Deutschland"
						bind:value={$form.invoiceCountry}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="invoicePhone">Invoice Phone</Field.Label>
					<Input
						name="invoicePhone"
						id="invoicePhone"
						autocomplete="off"
						placeholder="0123456789"
						bind:value={$form.invoicePhone}
					/>
				</Field.Field>
			</div>
		</div>

	</form>
</div>
