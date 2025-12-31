<script lang="ts">
	import { api } from '$convex/_generated/api.js';
	import SiteHeader from '$lib/components/site-header.svelte';
	import Suspense from '$lib/components/Suspense.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { useQuery } from 'convex-svelte';
	import Company from './Company.svelte';
	const query = useQuery(api.companies.get, {});
</script>

<Suspense {query}>
	{#snippet children(company)}
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
