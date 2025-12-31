<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import Label from '$lib/components/ui/label/label.svelte';
	import InlineInput from '$lib/components/InlineInput.svelte';
	import { action } from '$lib/action.svelte';
	import { useConvexClient } from 'convex-svelte';
	import { api } from '$convex/_generated/api';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';

	type Props =
		| {
				label: string;
				key: string;
				value: string;
				placeholder: string;
				checkbox?: boolean;
		  }
		| {
				label: string;
				key: string;
				value: boolean;
				checkbox: true;
		  };

	let props: Props = $props();

	const client = useConvexClient();

	const update = action(async (value: string | boolean) => {
		await client.mutation(api.companies.updateField, {
			field: props.key,
			value: value,
		});
	}, `Fehler beim Aktualisieren von ${props.label}`);
</script>

{#if props.checkbox}
	<div class="flex items-center gap-2">
		<Checkbox
			id={props.key}
			checked={props.value as boolean}
			onCheckedChange={(checked) => update.run(checked)}
		/>
		<Label for={props.key} class="lg:justify-self-end">{props.label}</Label>
		{#if update.isLoading}
			<Spinner />
		{/if}
	</div>
{:else}
	<InlineInput
		id={props.key}
		label={props.label}
		bind:value={props.value as string}
		{update}
		placeholder={props.placeholder}
	/>
{/if}
