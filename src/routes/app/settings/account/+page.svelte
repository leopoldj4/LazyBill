<script lang="ts">
	import { api } from '$convex/_generated/api.js';
	import { authClient } from '$lib/auth-client';
	import { action } from '$lib/action.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import CheckIcon from '@lucide/svelte/icons/check';
	import KeyRoundIcon from '@lucide/svelte/icons/key-round';
	import MailIcon from '@lucide/svelte/icons/mail';
	import ShieldAlertIcon from '@lucide/svelte/icons/shield-alert';
	import TrashIcon from '@lucide/svelte/icons/trash-2';
	import XIcon from '@lucide/svelte/icons/x';
	import { useAuth } from '@mmailaender/convex-better-auth-svelte/svelte';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { toast } from 'svelte-sonner';

	const auth = useAuth();
	const client = useConvexClient();
	const authMethods = useQuery(api.account.getAuthMethods, {});

	// Email change dialog state
	let emailDialogOpen = $state(false);
	let newEmail = $state('');
	let emailPassword = $state('');

	// Password change dialog state
	let passwordDialogOpen = $state(false);
	let currentPassword = $state('');
	let newPassword = $state('');
	let confirmPassword = $state('');

	// Delete account dialog state
	let deleteDialogOpen = $state(false);
	let deletePassword = $state('');
	let deleteConfirmation = $state('');

	// Actions
	const changeEmailAction = action(async (_: void) => {
		if (!newEmail || !emailPassword) {
			toast.error('Bitte fülle alle Felder aus');
			return;
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(newEmail)) {
			toast.error('Bitte gib eine gültige E-Mail-Adresse ein');
			return;
		}

		try {
			await client.mutation(api.account.updateEmail, { newEmail, password: emailPassword });
			toast.success('E-Mail-Adresse wurde erfolgreich geändert');
			emailDialogOpen = false;
			newEmail = '';
			emailPassword = '';
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Fehler beim Ändern der E-Mail');
		}
	}, 'Fehler beim Ändern der E-Mail-Adresse');

	const changePasswordAction = action(async (_: void) => {
		if (!currentPassword || !newPassword || !confirmPassword) {
			toast.error('Bitte fülle alle Felder aus');
			return;
		}

		if (newPassword !== confirmPassword) {
			toast.error('Die Passwörter stimmen nicht überein');
			return;
		}

		if (newPassword.length < 8) {
			toast.error('Das Passwort muss mindestens 8 Zeichen lang sein');
			return;
		}

		try {
			// Use Better Auth's client API to change password
			const result = await authClient.changePassword({
				currentPassword,
				newPassword,
				revokeOtherSessions: false,
			});

			if (result.error) {
				toast.error(result.error.message || 'Fehler beim Ändern des Passworts');
				return;
			}

			toast.success('Passwort wurde erfolgreich geändert');
			passwordDialogOpen = false;
			currentPassword = '';
			newPassword = '';
			confirmPassword = '';
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Fehler beim Ändern des Passworts');
		}
	}, 'Fehler beim Ändern des Passworts');

	const deleteAccountAction = action(async (_: void) => {
		if (deleteConfirmation !== 'DELETE') {
			toast.error('Bitte gib "DELETE" zur Bestätigung ein');
			return;
		}

		if (!deletePassword) {
			toast.error('Bitte gib dein Passwort ein');
			return;
		}

		try {
			await client.mutation(api.account.deleteAccount, {
				password: deletePassword,
				confirmation: deleteConfirmation,
			});

			toast.success('Dein Account wurde gelöscht');

			// Sign out and redirect to home
			await authClient.signOut();
			window.location.href = '/';
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Fehler beim Löschen des Accounts');
		}
	}, 'Fehler beim Löschen des Accounts');

	function formatDate(timestamp: number) {
		return new Date(timestamp).toLocaleDateString('de-DE', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	}
</script>

<SiteHeader>Account</SiteHeader>

{#if authMethods.data}
	<div class="flex max-w-2xl flex-col gap-6">
		<!-- Account Information -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Account-Informationen</Card.Title>
				<Card.Description>Deine grundlegenden Account-Daten</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="flex items-center justify-between">
					<div class="space-y-1">
						<Label>E-Mail-Adresse</Label>
						<p class="text-sm text-gray-600">{authMethods.data.email}</p>
						{#if authMethods.data.emailVerified}
							<div class="flex items-center gap-1 text-xs text-green-600">
								<CheckIcon class="size-3" />
								Verifiziert
							</div>
						{:else}
							<div class="flex items-center gap-1 text-xs text-yellow-600">
								<XIcon class="size-3" />
								Nicht verifiziert
							</div>
						{/if}
					</div>
					{#if authMethods.data.hasPassword}
						<Button variant="outline" size="sm" onclick={() => (emailDialogOpen = true)}>
							<MailIcon class="size-4" />
							E-Mail ändern
						</Button>
					{/if}
				</div>

				<Separator />

				<div class="space-y-1">
					<Label>Account erstellt</Label>
					<p class="text-sm text-gray-600">{formatDate(authMethods.data.createdAt)}</p>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Authentication Methods -->
		<Card.Root>
			<Card.Header>
				<Card.Title>Anmeldemethoden</Card.Title>
				<Card.Description>Verwalte deine Anmeldeoptionen</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="flex size-10 items-center justify-center rounded-lg bg-gray-100">
							<MailIcon class="size-5 text-gray-600" />
						</div>
						<div>
							<p class="text-sm font-medium">E-Mail & Passwort</p>
							<p class="text-xs text-gray-500">Melde dich mit deiner E-Mail-Adresse an</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						{#if authMethods.data.hasPassword}
							<div class="flex items-center gap-1 text-sm text-green-600">
								<CheckIcon class="size-4" />
								Aktiv
							</div>
							<Button variant="outline" size="sm" onclick={() => (passwordDialogOpen = true)}>
								<KeyRoundIcon class="size-4" />
								Passwort ändern
							</Button>
						{:else}
							<div class="flex items-center gap-1 text-sm text-gray-500">
								<XIcon class="size-4" />
								Nicht eingerichtet
							</div>
						{/if}
					</div>
				</div>

				<Separator />

				<div class="flex items-center justify-between">
					<div class="flex items-center gap-3">
						<div class="flex size-10 items-center justify-center rounded-lg bg-gray-100">
							<svg class="size-5" viewBox="0 0 24 24">
								<path
									fill="#4285F4"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="#34A853"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="#FBBC05"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="#EA4335"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
						</div>
						<div>
							<p class="text-sm font-medium">Google</p>
							<p class="text-xs text-gray-500">Melde dich mit deinem Google-Account an</p>
						</div>
					</div>
					{#if authMethods.data.hasGoogle}
						<div class="flex items-center gap-1 text-sm text-green-600">
							<CheckIcon class="size-4" />
							Verbunden
						</div>
					{:else}
						<div class="flex items-center gap-1 text-sm text-gray-500">
							<XIcon class="size-4" />
							Nicht verbunden
						</div>
					{/if}
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Danger Zone -->
		<Card.Root class="border-red-200">
			<Card.Header>
				<Card.Title class="text-red-600">Gefahrenzone</Card.Title>
				<Card.Description>Permanente und unumkehrbare Aktionen</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="flex items-center justify-between">
					<div class="space-y-1">
						<p class="text-sm font-medium">Account löschen</p>
						<p class="text-xs text-gray-500">
							Löscht permanent deinen Account und alle zugehörigen Daten
						</p>
					</div>
					<Button
						variant="destructive"
						size="sm"
						onclick={() => (deleteDialogOpen = true)}
						disabled={deleteAccountAction.isLoading}
					>
						<TrashIcon class="size-4" />
						Account löschen
					</Button>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
{/if}

<!-- Change Email Dialog -->
<Dialog.Root bind:open={emailDialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>E-Mail-Adresse ändern</Dialog.Title>
			<Dialog.Description>
				Gib deine neue E-Mail-Adresse und dein aktuelles Passwort ein.
			</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 py-4">
			<div class="space-y-2">
				<Label for="new-email">Neue E-Mail-Adresse</Label>
				<Input
					id="new-email"
					type="email"
					placeholder="neue@email.de"
					bind:value={newEmail}
					disabled={changeEmailAction.isLoading}
				/>
			</div>
			<div class="space-y-2">
				<Label for="email-password">Aktuelles Passwort</Label>
				<Input
					id="email-password"
					type="password"
					placeholder="••••••••"
					bind:value={emailPassword}
					disabled={changeEmailAction.isLoading}
				/>
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (emailDialogOpen = false)}>Abbrechen</Button>
			<Button onclick={() => changeEmailAction.run(undefined)} disabled={changeEmailAction.isLoading}>
				{#if changeEmailAction.isLoading}
					<div
						class="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"
					></div>
				{:else}
					E-Mail ändern
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Change Password Dialog -->
<Dialog.Root bind:open={passwordDialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Passwort ändern</Dialog.Title>
			<Dialog.Description>
				Gib dein aktuelles Passwort und dein neues Passwort ein.
			</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 py-4">
			<div class="space-y-2">
				<Label for="current-password">Aktuelles Passwort</Label>
				<Input
					id="current-password"
					type="password"
					placeholder="••••••••"
					bind:value={currentPassword}
					disabled={changePasswordAction.isLoading}
				/>
			</div>
			<div class="space-y-2">
				<Label for="new-password">Neues Passwort</Label>
				<Input
					id="new-password"
					type="password"
					placeholder="••••••••"
					bind:value={newPassword}
					disabled={changePasswordAction.isLoading}
				/>
				<p class="text-xs text-gray-500">Mindestens 8 Zeichen</p>
			</div>
			<div class="space-y-2">
				<Label for="confirm-password">Neues Passwort bestätigen</Label>
				<Input
					id="confirm-password"
					type="password"
					placeholder="••••••••"
					bind:value={confirmPassword}
					disabled={changePasswordAction.isLoading}
				/>
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (passwordDialogOpen = false)}>Abbrechen</Button>
			<Button onclick={() => changePasswordAction.run(undefined)} disabled={changePasswordAction.isLoading}>
				{#if changePasswordAction.isLoading}
					<div
						class="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"
					></div>
				{:else}
					Passwort ändern
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Delete Account Dialog -->
<Dialog.Root bind:open={deleteDialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2 text-red-600">
				<ShieldAlertIcon class="size-5" />
				Account löschen
			</Dialog.Title>
			<Dialog.Description class="space-y-2">
				<p>Diese Aktion kann nicht rückgängig gemacht werden.</p>
				<p class="font-medium">
					Dies wird permanent löschen: deine Firma, alle Kunden, Rechnungen, Aufgaben und
					Zeiteinträge.
				</p>
			</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 py-4">
			<div class="space-y-2">
				<Label for="delete-password">Dein Passwort</Label>
				<Input
					id="delete-password"
					type="password"
					placeholder="••••••••"
					bind:value={deletePassword}
					disabled={deleteAccountAction.isLoading}
				/>
			</div>
			<div class="space-y-2">
				<Label for="delete-confirmation">Gib "DELETE" ein, um zu bestätigen</Label>
				<Input
					id="delete-confirmation"
					type="text"
					placeholder="DELETE"
					bind:value={deleteConfirmation}
					disabled={deleteAccountAction.isLoading}
				/>
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (deleteDialogOpen = false)}>Abbrechen</Button>
			<Button
				variant="destructive"
				onclick={() => deleteAccountAction.run(undefined)}
				disabled={deleteAccountAction.isLoading || deleteConfirmation !== 'DELETE'}
			>
				{#if deleteAccountAction.isLoading}
					<div
						class="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"
					></div>
				{:else}
					<TrashIcon class="size-4" />
					Account permanent löschen
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
