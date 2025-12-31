<script lang="ts" generics="T">
	import type { Action } from '$lib/action.svelte';
	import * as InputGroup from './ui/input-group';
	import Spinner from '$lib/components/ui/spinner/spinner.svelte';
	import CheckIcon from '@lucide/svelte/icons/check';

	type Props = {
		value: string;
		id: string;
		placeholder: string;
		label?: string;
		update: Action<T>;
	};

	let { value = $bindable(), id, placeholder, label, update }: Props = $props();

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
		<InputGroup.Input type="text" bind:value={newValue} {placeholder} autocomplete="off" />
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
