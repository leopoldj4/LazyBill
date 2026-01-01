<script lang="ts">
	import type { Action } from '$lib/action.svelte';
	import * as InputGroup from './ui/input-group';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import CheckIcon from '@lucide/svelte/icons/check';
	import Iban from '$lib/Iban.svelte';

	type Props = {
		value: string;
		id: string;
		placeholder?: string;
		label?: string;
		update: Action<string>;
		iban?: boolean;
	};

	let { value = $bindable(), id, placeholder, label, update, iban }: Props = $props();

	let newValue = $state(value);
</script>

<form
	onsubmit={(ev) => {
		ev.preventDefault();
		update.run(newValue);
	}}
>
	<InputGroup.Root>
		{#if label}
			<InputGroup.Addon align="inline-start">
				{label}
			</InputGroup.Addon>
		{/if}
		{#if iban}
			<Iban bind:value={newValue} class="flex-1 rounded-none border-0 bg-transparent shadow-none dark:bg-transparent outline-none" {id} {placeholder} autocomplete="off" />
		{:else}
			<InputGroup.Input type="text" bind:value={newValue} {id} {placeholder} autocomplete="off" />
		{/if}
		{#if newValue !== value}
			<InputGroup.Addon align="inline-end">
				<InputGroup.Button type="submit" variant="default">
					{#if update.isLoading}
						<Spinner />
					{:else}
						<CheckIcon />
					{/if}
				</InputGroup.Button>
			</InputGroup.Addon>
		{/if}
	</InputGroup.Root>
</form>
