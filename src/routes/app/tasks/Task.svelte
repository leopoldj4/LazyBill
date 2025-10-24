<script lang="ts">
	import type { task as TaskType, customer as Customer } from '$lib/server/db/schema';
	import * as Table from '$lib/components/ui/table';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import TimerIcon from '@lucide/svelte/icons/timer';
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import DebouncedInput from '$lib/components/DebouncedInput.svelte';

	type TaskRepr = {
		id: string;
		done: boolean;
		name: string;
		customerId: string | null;
	};

	let {
		task,
		customers,
		onUpdateTask,
	}: {
		task: typeof TaskType.$inferSelect;
		customers: (typeof Customer.$inferSelect)[];
		onUpdateTask: (data: TaskRepr) => void;
	} = $props();

	let taskState = $state<TaskRepr>({
		id: task.id,
		done: task.done,
		name: task.name,
		customerId: task.customerId,
	});

	// svelte-ignore state_referenced_locally
	let previousTaskState = $state(taskState);

	async function post(url: string, data: Record<string, string>) {
		const formData = new FormData();
		for (const [key, value] of Object.entries(data)) {
			formData.append(key, value);
		}
		const response = await fetch(url, {
			method: 'POST',
			body: formData,
		});
		if (response.status != 200) {
			throw new Error(`Unexpected response status: ${response.status}`);
		}
	}

	async function updateTask() {
		console.log('updateTask', taskState);

		try {
			onUpdateTask(taskState);

			await post(`?/updateTask`, {
				taskId: taskState.id,
				name: taskState.name,
				customerId: taskState.customerId ?? '',
				done: taskState.done ? 'true' : 'false',
			});
			previousTaskState = taskState;
		} catch (error) {
			console.error(error);
			taskState = previousTaskState;
			onUpdateTask(previousTaskState);
		}
	}
</script>

<Table.Row>
	<Table.Cell>
		<Checkbox class="size-5" bind:checked={taskState.done} onCheckedChange={updateTask} />
	</Table.Cell>
	<Table.Cell>
		<Select.Root
			type="single"
			value={taskState.customerId || undefined}
			onValueChange={(newValue) => {
				taskState.customerId = newValue || null;
				updateTask();
			}}
			name="customerId"
		>
			<Select.Trigger class="w-full">
				{taskState.customerId
					? customers.find((customer) => customer.id === taskState.customerId)!.name
					: 'Select a customer'}
			</Select.Trigger>
			<Select.Content>
				{#each customers as customer}
					<Select.Item value={customer.id}>{customer.name}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</Table.Cell>
	<Table.Cell>
		<DebouncedInput bind:value={taskState.name} onDebounce={updateTask} class="border-none" />
	</Table.Cell>
	<Table.Cell>
		<Button variant="outline" class="mr-3">
			<TimerIcon />
			Track time
		</Button>
		<Button variant="outline">
			<EllipsisIcon />
			More
		</Button>
	</Table.Cell>
</Table.Row>
