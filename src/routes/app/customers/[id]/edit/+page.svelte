<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import SaveIcon from '@lucide/svelte/icons/save';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { superForm } from 'sveltekit-superforms';
	import { buttonVariants } from '$lib/components/ui/button';
	import CustomerForm from '$lib/components/CustomerForm.svelte';

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

	<form id="edit-form" method="post" class="mt-8" use:enhance>
		<CustomerForm bind:form={$form} mode="edit" />
	</form>
</div>
