<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { api } from '$convex/_generated/api.js';
	import Suspense from '$lib/components/Suspense.svelte';
	import Company from './Company.svelte';
	const query = useQuery(api.companies.get, {});
</script>

<Suspense {query}>
	{#snippet children(data)}
		{@const company = query.data!}
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/app/settings">Einstellungen</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>Meine Firma</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<SiteHeader>Meine Firma</SiteHeader>

		<Company {company} />

	{/snippet}
</Suspense>
