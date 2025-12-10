<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import CheckIcon from '@lucide/svelte/icons/check';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { superForm } from 'sveltekit-superforms';
	import CustomerForm from '$lib/components/CustomerForm.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import SiteHeader from '$lib/components/site-header.svelte';

	const { data } = $props();

	let { form, enhance } = superForm(data.form);
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/app/customers">Kunden</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>Neuer Kunde</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<SiteHeader>Neuer Kunde</SiteHeader>
<div>
	<Button type="submit">
		<CheckIcon />
		Fertig
	</Button>
</div>
<form method="post" use:enhance>
	<CustomerForm bind:form={$form} />
</form>
