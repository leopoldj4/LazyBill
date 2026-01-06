<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { type PathItem, addPathItem, removePathItem, updatePathItem } from '$lib/path.svelte';

	interface Props {
		label: string;
		href: string;
	}

	const props: Props = $props();

	const label = $derived(props.label);
	const href = $derived(props.href);
	let id = $state(-1);

	$effect(() => {
		props.href;
		props.label;
		untrack(() => {
			updatePathItem(id, props);
		});
	});

	onMount(() => {
		id = addPathItem(props);

		return () => {
			removePathItem(href);
		};
	});
</script>
