<script lang="ts">
	import '@fontsource/atkinson-hyperlegible/400';
	import '@fontsource/atkinson-hyperlegible/700';
	import '@fontsource-variable/funnel-display';
	import { createSvelteAuthClient } from '@mmailaender/convex-better-auth-svelte/svelte'; 
	import { authClient } from '$lib/auth-client'; 
	createSvelteAuthClient({ authClient }); 

	import '../app.css';
	import favicon from '$lib/assets/logo.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Watchtower</title>
	<link rel="manifest" href="/manifest.json" />
</svelte:head>

{@render children?.()}
