<script lang="ts">
	import CustomerForm from '$lib/components/CustomerForm.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import Button from '$lib/components/ui/button/button.svelte';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { superForm } from 'sveltekit-superforms';
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
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/app/customers/{data.customer.id}"
				>{data.customer.name}</Breadcrumb.Link
			>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>Bearbeiten</Breadcrumb.Item></Breadcrumb.List
	>
</Breadcrumb.Root>

<div class="mb-6 flex items-center justify-between">
	<SiteHeader>Kunde bearbeiten</SiteHeader>
	<Button type="submit" form="edit-form">
		<CheckIcon />
		Fertig
	</Button>
</div>

<form id="edit-form" method="post" class="mt-8" use:enhance>
	<CustomerForm bind:form={$form} mode="edit" />
</form>
