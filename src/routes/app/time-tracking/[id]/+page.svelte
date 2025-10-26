<script lang="ts">
	import XIcon from '@lucide/svelte/icons/x';
	import { buttonVariants } from '$lib/components/ui/button';
</script>

<div class="flex justify-end">
	<a href="/app/time-tracking" class={buttonVariants({ variant: 'outline' })}>
		<XIcon /> Close
	</a>
</div>
