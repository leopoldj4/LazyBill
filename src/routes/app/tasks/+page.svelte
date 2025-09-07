<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import * as Select from '$lib/components/ui/select';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import EditIcon from '@lucide/svelte/icons/edit';
	import ListCheckIcon from '@lucide/svelte/icons/list-check';
	import type { PageProps } from './$types';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Task from './Task.svelte';
	import { enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';

	let { data }: PageProps = $props();

	let showDone = $state(false);

	let tasks = $state(data.tasks);
	let filteredTasks = $derived(tasks.filter((task) => task.done === showDone));

	let selectedCustomer = $state<string | undefined>(undefined);

	function updateTask(taskId: string, newState: { done: boolean, name: string, customerId: string | null }) {
		tasks = tasks.map((task) => {
			if (task.id === taskId) {
				return { ...task, ...newState };
			}
			return task;
		});
		filteredTasks = filteredTasks.filter((task) => task.done === showDone);
	}
</script>

<SiteHeader>What are you working on today?</SiteHeader>

<form class="flex flex-row gap-4" method="post" action="?/createTask" use:enhance={() => {return invalidateAll()}}>
	<Select.Root type="single" bind:value={selectedCustomer} name="customerId" required>
		<Select.Trigger class="w-[180px]">
			{selectedCustomer
				? data.customers.find((customer) => customer.id === selectedCustomer)!.name
				: 'Select a customer'}
		</Select.Trigger>
		<Select.Content>
			{#each data.customers as customer}
				<Select.Item value={customer.id}>{customer.name}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>

	<Input type="text" placeholder="Task name" name="taskName" />

	<Button type="submit">
		<PlusIcon />
		Create
	</Button>
</form>

<Separator />

<div class="flex flex-row gap-4">
	<Button variant={showDone ? 'default' : 'outline'} onclick={() => {showDone = !showDone;}}>
		<ListCheckIcon /> Show done tasks
	</Button>
</div>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head class="w-[40px]"></Table.Head>
			<Table.Head class="w-[200px]">Customer</Table.Head>
			<Table.Head>Name</Table.Head>
			<Table.Head>Actions</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each filteredTasks as task (task.id)}
			<Task {task} customers={data.customers} onUpdateTask={(data) => updateTask(task.id, data)} />
		{/each}
	</Table.Body>
</Table.Root>
