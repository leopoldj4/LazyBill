<script lang="ts">
	import type { WithElementRef } from 'bits-ui';
	import Input from './ui/input/input.svelte';
	import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';

	type Props = WithElementRef<HTMLInputAttributes> & {
		debounce?: number;
		onDebounce: () => void;
	};

	let {
		debounce = 1000,
		onDebounce,
		ref = $bindable(null),
		type,
		value = $bindable(),
		files = $bindable(),
		...props
	}: Props = $props();

	let debounceTimer = $state<NodeJS.Timeout | null>(null);

	function textInputDebounce() {
		if (debounceTimer != null) {
			clearTimeout(debounceTimer);
		}
		debounceTimer = setTimeout(() => {
			debounceTimer = null;
			onDebounce();
		}, 1000);
	}
</script>

<Input onkeyup={textInputDebounce} bind:ref type={type || 'text'} bind:value {...props} />
