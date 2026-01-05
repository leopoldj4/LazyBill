<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { useSidebar } from '$lib/components/ui/sidebar/context.svelte.js';

	const sidebar = useSidebar();

	beforeNavigate(() => {
		sidebar.setOpenMobile(false);
	});
</script>
