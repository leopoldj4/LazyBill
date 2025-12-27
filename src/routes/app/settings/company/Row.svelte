<script lang="ts">
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';

	type Props = {
		label: string;
		value: string;
        checkbox?: boolean;
	} | {
		label: string;
		value: boolean;
		checkbox: true;
	};

	let { label, value = $bindable(), checkbox = false }: Props = $props();
</script>

<div class="grid grid-cols-1 lg:grid-cols-[6rem_14rem] gap-4 items-center">
	<Label for={label} class="lg:justify-self-end">{label}</Label>
	
	{#if checkbox}
		<Checkbox id={label} bind:checked={value as boolean} />
	{:else}
		<Input type="text" id={label} bind:value />
	{/if}
</div>
