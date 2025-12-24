<script lang="ts">
	import XIcon from '@lucide/svelte/icons/x';
	import { buttonVariants } from '$lib/components/ui/button';
	import DebouncedInput from '$lib/components/DebouncedInput.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { superForm } from 'sveltekit-superforms';

	const { data } = $props();

	const { form, enhance, submit } = superForm(data.form, {
		resetForm: false,
		invalidateAll: true,
	});

	function formatDateTime(date: Date | string): string {
		const dateObj = typeof date === 'string' ? new Date(date) : date;
		return dateObj.toLocaleString();
	}

	function formatDuration(startTime: Date | string, stopTime?: Date | string | null): string {
		const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
		const end = stopTime
			? typeof stopTime === 'string'
				? new Date(stopTime)
				: stopTime
			: new Date();
		const duration = end.getTime() - start.getTime();

		const hours = Math.floor(duration / 3600000);
		const minutes = Math.floor((duration % 3600000) / 60000);
		const seconds = Math.floor((duration % 60000) / 1000);

		return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	}

	function handleDebounce() {
		submit();
	}
</script>

<form
	method="post"
	action="?/updateDescription"
	use:enhance
	class="flex min-h-full flex-col gap-4 border-l border-l-border p-8"
>
	<div>
		<a href="/app/time-tracking" class={buttonVariants({ variant: 'outline' })}>
			<XIcon /> Close
		</a>
	</div>

	<DebouncedInput
		styled={false}
		onDebounce={handleDebounce}
		bind:value={$form.description}
		class="border-none text-3xl shadow-none outline-none focus:outline-none"
		placeholder="Enter title"
		name="description"
	/>

	<div class="mt-4 flex flex-col gap-4">
		<div class="grid grid-cols-[120px_1fr] items-center gap-2">
			<Label class="text-muted-foreground">Customer</Label>
			<div>
				{data.entry.customer?.name || 'No customer assigned'}
			</div>
		</div>

		<div class="grid grid-cols-[120px_1fr] items-center gap-2">
			<Label class="text-muted-foreground">Start Time</Label>
			<div>
				{formatDateTime(data.entry.startTime)}
			</div>
		</div>

		{#if data.entry.stopTime}
			<div class="grid grid-cols-[120px_1fr] items-center gap-2">
				<Label class="text-muted-foreground">Stop Time</Label>
				<div>
					{formatDateTime(data.entry.stopTime)}
				</div>
			</div>
		{/if}

		<div class="grid grid-cols-[120px_1fr] items-center gap-2">
			<Label class="text-muted-foreground">Duration</Label>
			<div class="font-mono">
				{formatDuration(data.entry.startTime, data.entry.stopTime)}
			</div>
		</div>
	</div>
</form>
