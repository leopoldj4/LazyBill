<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	let name = $state('');
	let phone = $state('');
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/app/setup">Einrichtung</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>Basisinformationen</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<SiteHeader>Basisinformationen</SiteHeader>

<div class="grid grid-cols-[7rem_12rem] gap-4">
	<Label for="name" class="justify-self-end">Name</Label>
	<Input type="text" id="name" placeholder="Name" bind:value={name} required />
	<Label for="phone" class="justify-self-end">Telefon</Label>
	<Input type="text" id="phone" placeholder="Telefon" bind:value={phone} />
</div>

<div class="flex flex-row gap-2">
	<Button href="/app/setup" variant="outline">Zurück</Button>

	<Button href="/app/setup/address">Weiter</Button>
</div>
