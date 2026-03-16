<script lang="ts">
	import { authClient } from '$lib/auth-client.js';

	import * as Card from '$lib/components/ui/card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { goto } from '$app/navigation';
	import { sleep } from '$lib';
	import { action } from '$lib/action.svelte';
	import { Spinner } from '$lib/components/ui/spinner';

	let name = $state('');
	let email = $state('');
	let password = $state('');

	let error = $state('');

	const signUp = action(async (e: Event) => {
		e.preventDefault();

		const { error: signUpError } = await authClient.signUp.email({
			name: name,
			email: email,
			password: password,
			callbackURL: '/app',
		});

		if (signUpError) {
			error = signUpError.message || 'An unknown error occurred';
		}

		await sleep(500);
		await goto('/app');
	}, 'An unknown error occurred');
</script>

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Sign Up</Card.Title>
			<Card.Description>Enter your email below to sign up for an account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form onsubmit={signUp.run}>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<Label for="name">Name</Label>
						<Input id="name" type="text" placeholder="John Doe" required bind:value={name} data-1p-ignore={false} />
					</div>
					<div class="grid gap-2">
						<Label for="email">Email</Label>
						<Input
							id="email"
							type="email"
							placeholder="m@example.com"
							required
							bind:value={email}
							data-1p-ignore={false}
						/>
					</div>
					<div class="grid gap-2">
						<Label for="password">Password</Label>
						<Input id="password" type="password" required bind:value={password} data-1p-ignore={false} />
					</div>
					{#if error}
						<p class="text-red-500">{error}</p>
					{/if}
					<Button type="submit" class="w-full" disabled={signUp.isLoading}>
						{#if signUp.isLoading}
							<Spinner class="size-4" />
						{:else}
							Sign Up
						{/if}
					</Button>
				</div>

				<div class="mt-4 text-center text-sm">
					Already have an account?
					<a href="/" class="underline"> Login </a>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
