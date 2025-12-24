<script lang="ts">
	let { children } = $props();
</script>

<h1 class="font-displa flex items-center gap-4 text-4xl">
	{@render children?.()}
</h1>
