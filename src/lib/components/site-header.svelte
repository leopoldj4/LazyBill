<script lang="ts">
    let { children } = $props();
</script>

<h1 class="text-4xl font-display">
    {@render children?.()}
</h1>