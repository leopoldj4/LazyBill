<script lang="ts">
	import Path from '$lib/components/Path.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	const { children, data } = $props();
	import { page } from '$app/state';
	import Container from '$lib/components/Container.svelte';
	import SiteHeader from '$lib/components/site-header.svelte';

	type Page = {
		href: string;
		label: string;
	};

	const pages: Page[] = [
		{
			href: `basics`,
			label: 'Basisdaten',
		},
		{
			href: `invoices`,
			label: 'Rechnungen',
		},
		{ href: `bank`, label: 'Bank' },
		{ href: `taxes`, label: 'Steuer' },
	];
</script>

<Path label="Einstellungen" href="/app/company/{data.companyId}/settings" />

<SiteHeader>Einstellungen</SiteHeader>

<Sidebar.Provider class="gap-6 flex-col lg:flex-row">
	<Sidebar.Root collapsible="none" class="rounded-xl bg-background font-medium max-lg:w-full">
		<Sidebar.Content>
			<Sidebar.Group class="py-0">
				<Sidebar.Menu>
					{#each pages as pageItem}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								size="lg"
								class="px-4 text-[1rem] text-muted-foreground"
								data-active={pageItem.href === page.url.pathname.split('/').pop()}
							>
								{#snippet child({ props })}
									<a href="/app/company/{data.companyId}/settings/{pageItem.href}" {...props}
										>{pageItem.label}</a
									>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>

	<div class="w-full">
		{@render children?.()}
	</div>
</Sidebar.Provider>
