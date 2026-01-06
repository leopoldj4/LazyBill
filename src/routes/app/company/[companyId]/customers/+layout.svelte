<script lang="ts">
	import Path from '$lib/components/Path.svelte';

	const { children, data } = $props();
</script>

<Path label="Kunden" href="/app/company/{data.companyId}/customers" />

{@render children?.()}