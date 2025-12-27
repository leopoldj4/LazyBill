<script lang="ts">
	import ChevronLeftIcon from '@lucide/svelte/icons/chevron-left';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { authClient } from '$lib/auth-client';

	let email = $state('');
	let password = $state('');

	let error = $state('');

	async function login(e: Event) {
		e.preventDefault();

		const { error: loginError } = await authClient.signIn.email({
			email: email,
			password: password,
			callbackURL: '/app',
		});

		if (loginError) {
			error = loginError.message || 'An unknown error occurred';
		}
	}
</script>

<form onsubmit={login} class="flex w-full max-w-xs flex-col gap-4">
	<a
		href="/login"
		class="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
	>
		<ChevronLeftIcon class="size-4" /> Choose a different login method
	</a>

	<div class="grid gap-2">
		<Label for="email">Email</Label>
		<Input id="email" type="email" placeholder="m@example.com" required bind:value={email} />
	</div>

	<div class="grid gap-2">
		<Label for="password">Password</Label>
		<Input id="password" type="password" placeholder="********" required bind:value={password} />
	</div>

	{#if error}
		<p class="text-red-500">{error}</p>
	{/if}

	<Button type="submit" class="mt-4 w-full">Login</Button>

	<div class="mt-4 text-center">
		Don't have an account?
		<a href="/sign-up" class="text-cyan-600 underline"> Sign up </a>
	</div>
</form>
