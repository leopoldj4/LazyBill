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
					<Field.Label for="customerNumber">Customer Number</Field.Label>
					<Input
						name="customerNumber"
						id="customerNumber"
						autocomplete="off"
						placeholder="CUST-001"
						bind:value={$form.customerNumber}
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
			<h2 class="text-lg font-bold">Address</h2>
			<div class="grid grid-cols-2 gap-x-8 gap-y-6">
				<Field.Field>
					<Field.Label for="street">Street</Field.Label>
					<Input
						name="street"
						id="street"
						autocomplete="off"
						placeholder="Müllerstraße 1"
						bind:value={$form.street}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="city">City</Field.Label>
					<Input
						name="city"
						id="city"
						autocomplete="off"
						placeholder="München"
						bind:value={$form.city}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="state">State</Field.Label>
					<Input
						name="state"
						id="state"
						autocomplete="off"
						placeholder="Bayern"
						bind:value={$form.state}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="zip">ZIP Code</Field.Label>
					<Input
						name="zip"
						id="zip"
						autocomplete="off"
						placeholder="80331"
						bind:value={$form.zip}
					/>
				</Field.Field>
				<Field.Field>
					<Field.Label for="country">Country</Field.Label>
					<Input
						name="country"
						id="country"
						autocomplete="off"
						placeholder="Deutschland"
						bind:value={$form.country}
					/>
				</Field.Field>
			</div>
		</div>

		<div class="mt-4 grid grid-cols-[12rem_1fr] gap-4">
			<h2 class="text-lg font-bold">Additional Information</h2>
			<div class="grid grid-cols-1 gap-x-8 gap-y-6">
				<Field.Field>
					<Field.Label for="notes">Notes</Field.Label>
					<textarea
						name="notes"
						id="notes"
						class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
						placeholder="Additional notes about this customer..."
						bind:value={$form.notes}
					></textarea>
				</Field.Field>
			</div>
		</div>
	</form>
</div>
