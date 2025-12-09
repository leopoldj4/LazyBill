<script lang="ts">
    let { children } = $props();
</script>

<h1 class="text-4xl font-displa flex items-center gap-4">
    {@render children?.()}
</h1>