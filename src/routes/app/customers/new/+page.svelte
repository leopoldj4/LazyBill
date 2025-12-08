<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import SaveIcon from '@lucide/svelte/icons/save';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { superForm } from 'sveltekit-superforms';
	import CustomerForm from '$lib/components/CustomerForm.svelte';

	const { data } = $props();

	let { form, enhance } = superForm(data.form);
</script>

<form method="post" use:enhance>
	<div class="flex flex-row justify-between">
		<h1 class="text-2xl font-bold">New Customer</h1>
		<Button type="submit">
			<SaveIcon />
			Save Customer
		</Button>
	</div>

	<Separator class="my-8" />

	<CustomerForm bind:form={$form} mode="create" />
</form>
