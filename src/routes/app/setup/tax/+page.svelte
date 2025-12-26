<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
    import { Checkbox } from '$lib/components/ui/checkbox';

	let taxNumber = $state('');
	let smallBusiness = $state(false);
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
        <Breadcrumb.Item>
            <Breadcrumb.Link href="/app/setup/address">Adresse</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>
            <Breadcrumb.Link href="/app/setup/bank">Bank</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>Steuerliche Angaben</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<SiteHeader>Steuerliche Angaben</SiteHeader>

<div class="grid grid-cols-[7rem_12rem] gap-4">
	<Label for="taxNumber" class="justify-self-end">Steuer-Nr.</Label>
	<Input type="text" id="taxNumber" placeholder="Steuer-Nr." bind:value={taxNumber} required />
	<Label for="smallBusiness" class="justify-self-end">Kleinunternehmer</Label>
	<Checkbox id="smallBusiness" checked={smallBusiness} />

</div>

<div class="flex flex-row gap-2">
	<Button href="/app/setup/bank" variant="outline">Zurück</Button>

	<Button href="/app/setup/overview">Weiter</Button>
</div>
