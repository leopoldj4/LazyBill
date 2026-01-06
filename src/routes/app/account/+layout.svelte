<script lang="ts">
	import Path from '$lib/components/Path.svelte';

	const { children } = $props();
</script>

<Path href="/app/account" label="Mein Account" />

{@render children?.()}