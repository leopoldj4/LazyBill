<script lang="ts">
	import { api } from '$convex/_generated/api';
	import type { Doc } from '$convex/_generated/dataModel';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Suspense from '$lib/components/Suspense.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import CheckIcon from '@lucide/svelte/icons/check';
	import CircleOffIcon from '@lucide/svelte/icons/circle-off';
	import GroupIcon from '@lucide/svelte/icons/group';
	import PlusIcon from '@lucide/svelte/icons/plus';
	import UsersIcon from '@lucide/svelte/icons/users';
	import { Select as SelectBits } from 'bits-ui';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import UpdateCustomerDialog from './UpdateCustomerDialog.svelte';
	import TaskRow from './TaskRow.svelte';

	let updateCustomerDialog: ReturnType<typeof UpdateCustomerDialog>;

	const customersQuery = useQuery(api.customers.list, {});

	let showCompleted = $state(false);
	let search = $state<string | undefined>(undefined);

	const groupByOptions = {
		customer: { label: 'Kunde', icon: UsersIcon },
	} as const;
	let groupBy = $state<keyof typeof groupByOptions | undefined>(undefined);

	const tasksQuery = useQuery(api.tasks.list, () => ({ completed: showCompleted }));

	const client = useConvexClient();

	function groupTasks(tasks: Doc<'tasks'>[], option?: keyof typeof groupByOptions) {
		function group(task: Doc<'tasks'>[], key: keyof Doc<'tasks'>) {
			return task.reduce(
				(acc, task) => {
					const groupKey = String(task[key] ?? '');
					if (!acc[groupKey]) acc[groupKey] = [];
					acc[groupKey].push(task);
					return acc;
				},
				{} as Record<string, Doc<'tasks'>[]>,
			);
		}

		switch (option) {
			case 'customer':
				return group(tasks, 'customerId');

			default:
				return { '': tasks };
		}
	}
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>Aufgaben</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<SiteHeader>Aufgaben</SiteHeader>

<Suspense query={customersQuery}>
	{#snippet children(customers)}
		<div class="flex justify-between gap-2">
			<div class="flex flex-1 gap-2">
				<Input
					type="text"
					placeholder="Suchen ..."
					bind:value={search}
					class="h-8 w-[150px] lg:w-[250px]"
				/>
				<Button
					variant={showCompleted ? 'default' : 'outline'}
					size="sm"
					class={['border', showCompleted ? 'border-primary' : 'border-dashed']}
					onclick={() => (showCompleted = !showCompleted)}
				>
					<CheckIcon /> Abgeschlossene Anzeigen
				</Button>
				<Select.Root type="single" bind:value={groupBy}>
					<SelectBits.Trigger
						class={[
							'h-8 border',
							buttonVariants({ variant: groupBy ? 'default' : 'outline', size: 'sm' }),
							groupBy ? 'border-primary' : 'border-dashed',
						]}
					>
						{#if groupBy}
							{@const Icon = groupByOptions[groupBy].icon}
							<Icon></Icon>
							{groupByOptions[groupBy].label}
						{:else}
							<GroupIcon />

							Gruppieren
						{/if}
					</SelectBits.Trigger>
					<Select.Content>
						<Select.Item value=""><CircleOffIcon /> Nicht gruppieren</Select.Item>
						<Select.Separator />
						{#each Object.entries(groupByOptions) as [key, value]}
							<Select.Item value={key}>
								{@const Icon = value.icon}
								<Icon />
								{value.label}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<Button>
				<PlusIcon />
				Neu
			</Button>
		</div>
		<Suspense query={tasksQuery}>
			{#snippet children(tasks)}
				<div class="grid gap-2">
					{#each Object.entries(groupTasks(tasks, groupBy)) as [groupLabel, groupMembers]}
						<div class="mt-4 flex flex-col gap-2">
							{#if groupBy == 'customer' && groupLabel}
								<h2 class="text-lg font-medium">
									{customers.find((customer) => customer._id === groupLabel)!.name}
								</h2>
							{/if}
							{#each groupMembers as task (task._id)}
								<TaskRow
									{task}
									customer={customers.find((customer) => customer._id === task.customerId)}
									showCustomer={groupBy !== 'customer'}
									{updateCustomerDialog}
								/>
							{/each}
						</div>
					{/each}
				</div>
			{/snippet}
		</Suspense>
	{/snippet}
</Suspense>

<UpdateCustomerDialog bind:this={updateCustomerDialog} />
