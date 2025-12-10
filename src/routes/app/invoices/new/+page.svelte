<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import TrashIcon from '@lucide/svelte/icons/trash';
	import SaveIcon from '@lucide/svelte/icons/save';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Select from '$lib/components/ui/select';
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { invoiceTemplate } from '$lib/invoicetemplate';
	import { Textarea } from '$lib/components/ui/textarea';
	import Preview from '$lib/Preview.svelte';

	const { data } = $props();

	const form = superForm(data.form, { dataType: 'json' });
	const { enhance, form: formData } = form;

	const total = $derived(
		$formData.articles.reduce((acc, article) => acc + article.quantity * article.price, 0),
	);
</script>

<div class="grid grid-cols-2 gap-8">
	<form method="post" class="flex flex-col gap-8" use:enhance>
		<div class="flex flex-row justify-between">
			<h1 class="text-2xl font-bold">New Invoice</h1>
			<Form.Button>
				<SaveIcon />
				Save Invoice
			</Form.Button>
		</div>

		<Separator />

		<div class="grid grid-cols-2 gap-6">
			<Form.Field {form} name="customerId">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Customer</Form.Label>
						<Select.Root type="single" {...props} bind:value={$formData.customerId}>
							<Select.Trigger class="w-full">
								{$formData.customerId
									? data.customers.find((customer) => customer.id === $formData.customerId)!.name
									: 'Select a customer'}
							</Select.Trigger>
							<Select.Content>
								{#each data.customers as customer}
									<Select.Item value={customer.id}>{customer.name}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="invoiceNumber">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Invoice Number</Form.Label>
						<Input type="text" {...props} bind:value={$formData.invoiceNumber} />
					{/snippet}
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="invoiceDate">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Invoice Date</Form.Label>
						<Input type="date" {...props} bind:value={$formData.invoiceDate} />
					{/snippet}
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="invoiceDueDate">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Invoice Due Date</Form.Label>
						<Input type="date" {...props} bind:value={$formData.invoiceDueDate} />
					{/snippet}
				</Form.Control>
			</Form.Field>
		</div>

		<div class="flex flex-col gap-4">
			<h2 class="text-lg font-bold">Articles</h2>
			<div class="flex flex-col gap-4">
				<div class="grid grid-cols-[1fr_200px_200px_50px] gap-4">
					<p>Name</p>
					<p>Quantity</p>
					<p>Price</p>
				</div>

				{#each $formData.articles as article}
					<div class="grid grid-cols-[1fr_200px_200px_50px] gap-4">
						<Input type="text" bind:value={article.name} />
						<Input type="number" bind:value={article.quantity} />
						<Input type="number" bind:value={article.price} />
						<Button
							variant="ghost"
							onclick={() => {
								$formData.articles = $formData.articles.filter(
									(_, index) => index !== $formData.articles.indexOf(article),
								);
							}}
						>
							<TrashIcon />
						</Button>
					</div>
				{/each}

				<Button
					variant="outline"
					onclick={() => {
						$formData.articles = [...$formData.articles, { name: '', quantity: 1, price: 0 }];
					}}
				>
					<PlusIcon />
					Add Article
				</Button>

				<div class="text-right font-bold">
					Total: {total}
				</div>
			</div>
		</div>

		<Form.Field {form} name="notes">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Notes</Form.Label>
					<Textarea {...props} bind:value={$formData.notes} />
				{/snippet}
			</Form.Control>
		</Form.Field>
	</form>
	<Preview typstDocument={invoiceTemplate({
		customer: data.customers.find((customer) => customer.id === $formData.customerId)!,
		articles: $formData.articles,
		invoiceNumber: Number.parseInt($formData.invoiceNumber),
		invoiceDate: $formData.invoiceDate,
	}, data.company!)} />
</div>