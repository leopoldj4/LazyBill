<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import SaveIcon from '@lucide/svelte/icons/save';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { superForm } from 'sveltekit-superforms';
	import * as Field from '$lib/components/ui/field/';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from '$lib/components/ui/card';

	const { data } = $props();

	let { form, enhance } = superForm(data.form);
</script>

<svelte:head>
	<title>Account Settings</title>
</svelte:head>

<div class="container max-w-3xl">
	<div class="mb-6 flex flex-row items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold">Account Settings</h1>
			<p class="text-muted-foreground">Manage your account information and security settings.</p>
		</div>
	</div>
	<Separator />
	<form method="post" class="space-y-6 mt-6" use:enhance>
		<div class="grid grid-cols-1 gap-6">
			<Field.Field>
				<Field.Label for="name">Full Name</Field.Label>
				<Field.Description>Your display name</Field.Description>
				<Input
					name="name"
					id="name"
					autocomplete="name"
					placeholder="Enter your full name"
					bind:value={$form.name}
					required
				/>
			</Field.Field>

			<Field.Field>
				<Field.Label for="email">Email Address</Field.Label>
				<Field.Description>Your email address for login and notifications</Field.Description>
				<Input
					name="email"
					id="email"
					type="email"
					autocomplete="email"
					placeholder="Enter your email address"
					bind:value={$form.email}
					required
				/>
			</Field.Field>
		</div>

		<Separator />

		<div class="space-y-6">
			<div>
				<h3 class="mb-2 text-lg font-semibold">Change Password</h3>
				<p class="mb-4 text-sm text-muted-foreground">
					Leave password fields empty to keep your current password.
				</p>
			</div>

			<div class="grid grid-cols-1 gap-6">
				<Field.Field>
					<Field.Label for="currentPassword">Current Password</Field.Label>
					<Field.Description>Enter your current password to confirm changes</Field.Description>
					<Input
						name="currentPassword"
						id="currentPassword"
						type="password"
						autocomplete="current-password"
						placeholder="Enter your current password"
						bind:value={$form.currentPassword}
					/>
				</Field.Field>

				<Field.Field>
					<Field.Label for="newPassword">New Password</Field.Label>
					<Field.Description>Minimum 8 characters</Field.Description>
					<Input
						name="newPassword"
						id="newPassword"
						type="password"
						autocomplete="new-password"
						placeholder="Enter your new password"
						bind:value={$form.newPassword}
					/>
				</Field.Field>

				<Field.Field>
					<Field.Label for="confirmPassword">Confirm New Password</Field.Label>
					<Field.Description>Re-enter your new password to confirm</Field.Description>
					<Input
						name="confirmPassword"
						id="confirmPassword"
						type="password"
						autocomplete="new-password"
						placeholder="Confirm your new password"
						bind:value={$form.confirmPassword}
					/>
				</Field.Field>
			</div>
		</div>

		<div class="flex justify-end pt-6">
			<Button type="submit" size="lg">
				<SaveIcon />
				Save Changes
			</Button>
		</div>
	</form>
</div>
