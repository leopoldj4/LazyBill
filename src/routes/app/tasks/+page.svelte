<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import SiteHeader from '$lib/components/site-header.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Table from '$lib/components/ui/table';
	import ListCheckIcon from '@lucide/svelte/icons/list-check';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import type { PageProps } from './$types';
	import Task from './Task.svelte';

	let { data }: PageProps = $props();

	let showDone = $state(false);

	let tasks = $derived(data.tasks);

	let filteredCustomer = $state<string>('');

	let filteredTasks = $derived(
		tasks
			.filter((task) => task.done === showDone)
			.filter((task) => task.customerId === filteredCustomer || filteredCustomer === ''),
	);

	let selectedCustomer = $state<string | undefined>(undefined);

	function updateTask(
		taskId: string,
		newState: { done: boolean; name: string; customerId: string | null },
	) {
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

<form
	class="flex flex-row gap-4"
	method="post"
	action="?/createTask"
	use:enhance={() => {
		return invalidateAll();
	}}
>
	<Select.Root type="single" bind:value={selectedCustomer} name="customerId" required>
		<Select.Trigger class="w-[250px]">
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
	<Button
		variant={showDone ? 'default' : 'outline'}
		onclick={() => {
			showDone = !showDone;
		}}
	>
		<ListCheckIcon /> Show done tasks
	</Button>
	<Select.Root type="single" bind:value={filteredCustomer}>
		<Select.Trigger class="w-[250px]">
			{filteredCustomer
				? data.customers.find((customer) => customer.id === filteredCustomer)!.name
				: 'Filter by customer'}
		</Select.Trigger>
		<Select.Content>
			<Select.Item value="">All customers</Select.Item>
			<Select.Separator />
			{#each data.customers as customer}
				<Select.Item value={customer.id}>{customer.name}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
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
