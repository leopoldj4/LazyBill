<script lang="ts">
	import Calendar from '$lib/components/ui/calendar/calendar.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
	import { getLocalTimeZone, CalendarDate, CalendarDateTime } from '@internationalized/date';

	const id = $props.id();

	let open = $state(false);

	let {
		label,
		value = $bindable(),
	}: {
		label: string;
		value: CalendarDateTime | undefined;
	} = $props();

	let calendarValue = $derived(
		value ? new CalendarDate(value.year, value.month, value.day) : undefined
	);

	let timeValue = $derived(
		value
			? `${value.hour.toString().padStart(2, '0')}:${value.minute.toString().padStart(2, '0')}`
			: '00:00'
	);

	function handleDateChange(newDate: CalendarDate | undefined) {
		if (!newDate) return;
		const [hour, minute] = timeValue.split(':').map(Number);
		value = new CalendarDateTime(newDate.year, newDate.month, newDate.day, hour, minute);
		open = false;
	}

	function handleTimeChange(event: Event) {
		const input = event.target as HTMLInputElement;
		const [hour, minute] = input.value.split(':').map(Number);
		if (value) {
			value = new CalendarDateTime(value.year, value.month, value.day, hour, minute);
		}
	}

	function formatDisplay(): string {
		if (!value) return 'Datum & Zeit wählen';
		const date = value.toDate(getLocalTimeZone());
		return date.toLocaleString('de-DE', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	}
</script>

<div class="flex flex-col gap-3">
	<Label for="{id}-datetime" class="px-1">{label}</Label>
	<Popover.Root bind:open>
		<Popover.Trigger id="{id}-datetime">
			{#snippet child({ props })}
				<Button {...props} variant="outline" class="w-full justify-between font-normal">
					{formatDisplay()}
					<ChevronDownIcon />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-auto overflow-hidden p-0" align="start">
			<Calendar
				type="single"
				value={calendarValue}
				captionLayout="dropdown"
				onValueChange={handleDateChange}
			/>
			<div class="border-t p-3">
				<Label for="{id}-time" class="text-sm">Uhrzeit</Label>
				<Input
					id="{id}-time"
					type="time"
					value={timeValue}
					onchange={handleTimeChange}
					class="mt-1"
				/>
			</div>
		</Popover.Content>
	</Popover.Root>
</div>
