<script lang="ts">
	import type { InvoiceState } from '$convex/invoiceState';
	import * as Select from '$lib/components/ui/select';
	import { InvoiceStateDetail } from '$lib/invoiceState';
	import { Spinner } from '$lib/components/ui/spinner';
	import { action } from '$lib/action.svelte';
	import { useConvexClient } from 'convex-svelte';
	import { api } from '$convex/_generated/api';
	import type { Id } from '$convex/_generated/dataModel';

	const client = useConvexClient();

	const updateInvoiceState = action(async (params: { id: Id<'invoices'>; state: InvoiceState }) => {
		await client.mutation(api.invoices.updateInvoiceState, params);
	}, 'Fehler beim Aktualisieren des Status');

	let { value = $bindable(), invoiceId }: { value: InvoiceState; invoiceId: Id<'invoices'> } =
		$props();
</script>

<Select.Root
	type="single"
	bind:value
	onValueChange={(value) =>
		updateInvoiceState.run({ id: invoiceId, state: value as InvoiceState })}
>
	<Select.Trigger>
		{#if updateInvoiceState.isLoading}
			<Spinner class="size-4" />
		{:else}
			{@const Icon = InvoiceStateDetail[value].icon}
			<Icon class="size-4 {InvoiceStateDetail[value].textColor}" />
		{/if}
		{InvoiceStateDetail[value].name}
	</Select.Trigger>
	<Select.Content align="start">
		{#each Object.entries(InvoiceStateDetail) as [name, state]}
			<Select.Item value={name}>
				{@const Icon = state.icon}
				<Icon class="size-4 {state.textColor}" />
				{InvoiceStateDetail[name as InvoiceState].name}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
