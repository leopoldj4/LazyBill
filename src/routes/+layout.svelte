<script lang="ts">
	import '@fontsource/atkinson-hyperlegible';
	import '../app.css';
	import favicon from '$lib/assets/logo.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Tempora</title>
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

{@render children?.()}
