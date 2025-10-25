<script lang="ts">
	import { authClient } from '$lib/auth-client.js';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';

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

<div class="flex h-screen w-full items-center justify-center px-4">
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl font-display">Login</Card.Title>
			<Card.Description>Enter your email below to login to your account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form onsubmit={login}>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<Label for="email">Email</Label>
						<Input id="email" type="email" placeholder="m@example.com" required bind:value={email} />
					</div>
					<div class="grid gap-2">
						<div class="flex items-center">
							<Label for="password">Password</Label>
							<a href="##" class="ml-auto inline-block text-sm underline">
								Forgot your password?
							</a>
						</div>
						<Input id="password" type="password" required bind:value={password} />
					</div>
					<Button type="submit" class="w-full">Login</Button>
				</div>
				<div class="mt-4 text-center text-sm">
					Don't have an account?
					<a href="/sign-up" class="underline"> Sign up </a>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
