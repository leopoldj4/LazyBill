<script lang="ts">
    let { children } = $props();
</script>

<h1 class="text-2xl font-bold">
    {@render children?.()}
</h1>