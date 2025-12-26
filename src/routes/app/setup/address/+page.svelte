<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	let street = $state('');
	let zip = $state('');
	let city = $state('');
	let region = $state('');
	let country = $state('');
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/app/setup">Einrichtung</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/app/setup/basics">Basisinformationen</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>Adresse</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<SiteHeader>Adresse</SiteHeader>

<div class="grid grid-cols-[7rem_12rem] gap-4">
	<Label for="street" class="justify-self-end">Straße</Label>
	<Input type="text" id="street" placeholder="Straße" bind:value={street} />
	<Label for="zip" class="justify-self-end">PLZ</Label>
	<Input type="text" id="zip" placeholder="PLZ" bind:value={zip} />
	<Label for="city" class="justify-self-end">Stadt</Label>
	<Input type="text" id="city" placeholder="Stadt" bind:value={city} />
	<Label for="state" class="justify-self-end">Bundesland</Label>
	<Input type="text" id="state" placeholder="Bundesland" bind:value={region} />
	<Label for="country" class="justify-self-end">Land</Label>
	<Input type="text" id="country" placeholder="Land" bind:value={country} />
</div>

<div class="flex flex-row gap-2">
	<Button href="/app/setup/basics" variant="outline">Zurück</Button>

	<Button href="/app/setup/bank">Weiter</Button>
</div>
