<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import SaveIcon from '@lucide/svelte/icons/save';
	import { superForm } from 'sveltekit-superforms';
	import * as Field from '$lib/components/ui/field/';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { toast } from 'svelte-sonner';

	const { data } = $props();

	let { form, enhance } = superForm(data.form, {
		onUpdated({ form }) {
			if (form.valid) {
				toast.success('Company settings saved successfully');
			}
		},
	});
</script>

<svelte:head>
	<title>Company Settings</title>
</svelte:head>

<div class="container mx-auto py-6 max-w-2xl">
	<div class="flex flex-row justify-between items-center mb-6">
		<div>
			<h1 class="text-3xl font-bold">Company Settings</h1>
			<p class="text-muted-foreground">Manage your company information and business details.</p>
		</div>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Company Information</CardTitle>
			<CardDescription>Update your company details and contact information.</CardDescription>
		</CardHeader>
		<CardContent>
			<form method="post" class="space-y-6" use:enhance>
				<div class="grid grid-cols-1 gap-6">
					<Field.Field>
						<Field.Label for="name">Company Name</Field.Label>
						<Field.Description>The legal name of your company</Field.Description>
						<Input 
							name="name" 
							id="name" 
							autocomplete="organization" 
							placeholder="Enter company name" 
							bind:value={$form.name} 
							required 
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label for="phone">Phone Number</Field.Label>
						<Field.Description>Primary contact number</Field.Description>
						<Input 
							name="phone" 
							id="phone" 
							type="tel"
							autocomplete="tel" 
							placeholder="Enter phone number" 
							bind:value={$form.phone} 
							required 
						/>
					</Field.Field>
				</div>

				<div class="space-y-6">
					<div>
						<h3 class="text-lg font-semibold mb-4">Business Address</h3>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Field.Field>
							<Field.Label for="country">Country</Field.Label>
							<Input 
								name="country" 
								id="country" 
								autocomplete="country-name" 
								placeholder="Enter country" 
								bind:value={$form.country} 
								required 
							/>
						</Field.Field>

						<Field.Field>
							<Field.Label for="state">State / Province</Field.Label>
							<Input 
								name="state" 
								id="state" 
								autocomplete="address-level1" 
								placeholder="Enter state or province" 
								bind:value={$form.state} 
								required 
							/>
						</Field.Field>

						<Field.Field>
							<Field.Label for="city">City</Field.Label>
							<Input 
								name="city" 
								id="city" 
								autocomplete="address-level2" 
								placeholder="Enter city" 
								bind:value={$form.city} 
								required 
							/>
						</Field.Field>

						<Field.Field>
							<Field.Label for="zip">Zip / Postal Code</Field.Label>
							<Input 
								name="zip" 
								id="zip" 
								autocomplete="postal-code" 
								placeholder="Enter zip code" 
								bind:value={$form.zip} 
								required 
							/>
						</Field.Field>
					</div>

					<Field.Field>
						<Field.Label for="street">Street Address</Field.Label>
						<Input 
							name="street" 
							id="street" 
							autocomplete="address-line1" 
							placeholder="Enter street address" 
							bind:value={$form.street} 
							required 
						/>
					</Field.Field>

					<Field.Field>
						<Field.Label for="streetExtra">Address Line 2 (Optional)</Field.Label>
						<Field.Description>Apartment, suite, unit, building, floor, etc.</Field.Description>
						<Input 
							name="streetExtra" 
							id="streetExtra" 
							autocomplete="address-line2" 
							placeholder="Enter additional address details" 
							bind:value={$form.streetExtra} 
						/>
					</Field.Field>
				</div>

				<div class="space-y-6">
					<div>
						<h3 class="text-lg font-semibold mb-4">Business Settings</h3>
					</div>

					<Field.Field>
						<div class="flex items-center space-x-2">
							<Checkbox 
								name="smallBusiness" 
								id="smallBusiness" 
								bind:checked={$form.smallBusiness} 
							/>
							<Field.Label for="smallBusiness">Small Business</Field.Label>
						</div>
						<Field.Description>Mark this company as a small business for tax and reporting purposes.</Field.Description>
					</Field.Field>
				</div>

				<div class="flex justify-end pt-6">
					<Button type="submit" size="lg">
						<SaveIcon />
						Save Changes
					</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>

