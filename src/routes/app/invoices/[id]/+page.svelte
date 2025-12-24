<script lang="ts">
	let { data } = $props();
</script>

<div>
	<h1 class="mb-8 text-3xl font-bold">Invoice Preview</h1>
	<iframe src={`/app/invoices/${data.id}/render`} title="Invoice Preview" class="h-[80svh] w-full"
	></iframe>
</div>
