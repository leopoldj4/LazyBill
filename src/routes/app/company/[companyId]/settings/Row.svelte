<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import Label from '$lib/components/ui/label/label.svelte';
	import InlineInput from '$lib/components/InlineInput.svelte';
	import { action } from '$lib/action.svelte';
	import { useConvexClient } from 'convex-svelte';
	import { api } from '$convex/_generated/api';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import type { Id } from '$convex/_generated/dataModel.js';

	type BaseProps = {
		label: string;
		key: string;
		value: string | boolean;
		companyId: Id<'companies'>;
	};

	type Props =
		| ({
				placeholder: string;
				checkbox?: false;
				iban?: boolean;
		  } & BaseProps)
		| ({
				checkbox: true;
		  } & BaseProps);

	let { label, key, value = $bindable(), checkbox, companyId, ...restProps }: Props = $props();

	const client = useConvexClient();

	const update = action(async (value: string | boolean) => {
		await client.mutation(api.companies.updateField, {
			id: companyId,
			field: key,
			value: value,
		});
	}, `Fehler beim Aktualisieren von ${label}`);
</script>

{#if checkbox}
	<div class="flex items-center gap-2">
		<Checkbox
			id={key}
			checked={value as boolean}
			onCheckedChange={(checked) => update.run(checked)}
		/>
		<Label for={key} class="lg:justify-self-end">{label}</Label>
		{#if update.isLoading}
			<Spinner />
		{/if}
	</div>
{:else}
	<InlineInput id={key} {label} {...restProps} bind:value={value as string} {update} />
{/if}
