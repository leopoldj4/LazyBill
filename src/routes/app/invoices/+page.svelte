<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button";
	import PlusIcon from "@lucide/svelte/icons/plus";

</script>

<div>
	<h1 class="text-2xl font-bold">Invoices</h1>
	<div class="mt-4 flex flex-row gap-4">
		<a href="/app/invoices/new" class={buttonVariants({ variant: 'outline' })}>
			<PlusIcon />
			Add Invoice
		</a>
	</div>
</div>