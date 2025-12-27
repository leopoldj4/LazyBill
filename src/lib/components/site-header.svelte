<script lang="ts">
	let { children } = $props();
</script>

<h1 class="flex items-center gap-4 text-4xl flex-wrap">
	{@render children?.()}
</h1>
