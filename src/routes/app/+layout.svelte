<script lang="ts">
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	let { children, data } = $props();
</script>


<Sidebar.Provider>
	<AppSidebar user={data.user} />
	<Sidebar.Inset>
		<div class="flex flex-col gap-6 p-8">
			{@render children?.()}
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
