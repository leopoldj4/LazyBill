<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Junjo</title>
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

{@render children?.()}
