<script lang="ts">
	import CustomerForm from '$lib/components/CustomerForm.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import Button from '$lib/components/ui/button/button.svelte';
	import CheckIcon from '@lucide/svelte/icons/check';
	import { superForm } from 'sveltekit-superforms';

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

<form method="post" use:enhance>
	<Button type="submit" class="mb-8">
		<CheckIcon />
		Fertig
	</Button>
	<CustomerForm bind:form={$form} />
</form>
