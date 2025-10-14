<script lang="ts">
	let { data } = $props();
</script>

<div>
	<h1 class="text-3xl font-bold mb-8">Invoice Preview</h1>
	<iframe src={`/app/invoices/${data.id}/render`} title="Invoice Preview"class="w-full h-[80svh]"
	></iframe>
</div>
