<script lang="ts">
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import SiteHeader from '$lib/components/site-header.svelte';
</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/app/settings">Einstellungen</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>Rechnungen</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<SiteHeader>Rechnungen</SiteHeader>