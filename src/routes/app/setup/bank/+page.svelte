<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	let representative = $state('');
	let bankName = $state('');
	let bankIban = $state('');
	let bankBic = $state('');
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
        <Breadcrumb.Item>Bank</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<SiteHeader>Bank</SiteHeader>

<div class="grid grid-cols-[7rem_12rem] gap-4">
	<Label for="representative" class="justify-self-end">Vertreter</Label>
	<Input type="text" id="representative" placeholder="Vertreter" bind:value={representative} required />
	<Label for="bankName" class="justify-self-end">Name der Bank</Label>
	<Input type="text" id="bankName" placeholder="Bankname" bind:value={bankName} />
	<Label for="bankIban" class="justify-self-end">IBAN</Label>
	<Input type="text" id="bankIban" placeholder="IBAN" bind:value={bankIban} />
	<Label for="bankBic" class="justify-self-end">BIC</Label>
	<Input type="text" id="bankBic" placeholder="BIC" bind:value={bankBic} />

</div>

<div class="flex flex-row gap-2">
	<Button href="/app/setup/address" variant="outline">Zurück</Button>

	<Button href="/app/setup/tax">Weiter</Button>
</div>
