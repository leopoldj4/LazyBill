<script lang="ts">
	import SiteHeader from '$lib/components/site-header.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
    import DatePicker from '$lib/components/DatePicker.svelte';
    import { today, type CalendarDate } from '@internationalized/date';
    import { getLocalTimeZone } from '@internationalized/date';
	import Separator from '$lib/components/ui/separator/separator.svelte';
    import Button from '$lib/components/ui/button/button.svelte';
    import PlusIcon from '@lucide/svelte/icons/plus';
	import Input from '$lib/components/ui/input/input.svelte';
import CircleMinusIcon from '@lucide/svelte/icons/circle-minus';
import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	let { data } = $props();

    let invoiceDate = $state<CalendarDate>(today(getLocalTimeZone()));
    let invoiceDueDate = $state<CalendarDate>(today(getLocalTimeZone()).add({ days: 30 }));

    let notes = $state<string>('');

    let articles = $state<Article[]>([{ name: '', price: 0 }]);

    type Article = {
        name: string;
        price: number;
    };

</script>

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href="/app/customers">Kunden</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
            <Breadcrumb.Link href="/app/customers/{data.customer!.id}">{data.customer!.name}</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator />
        <Breadcrumb.Item>Neue Rechnung</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>

<SiteHeader>Neue Rechnung</SiteHeader>


<div class="grid gap-12 grid-cols-2">
    <div class="flex flex-col gap-8">
    <div class="flex flex-col gap-6 items-stretch w-full">
    <DatePicker label="Rechnungsdatum" value={invoiceDate} />
    <DatePicker label="Fälligkeitsdatum" value={invoiceDueDate} />
    
</div>


<h2 class="text-xl">Artikel</h2>


<div class="grid grid-cols-[min-content_1fr_100px] gap-4">
    <div />
    <p>Name</p>
    <p>Preis</p>

    {#each articles as article}
        <Button variant="ghost" onclick={() => {
            articles.splice(articles.indexOf(article), 1);
        }}>
            <CircleMinusIcon color="gray" />
        </Button>
        <Input type="text" bind:value={article.name} />
        <Input type="number" bind:value={article.price} />
    {/each}

    <Button variant="outline" class="col-span-3" onclick={() => {
        articles.push({ name: '', price: 0 });
    }}>
        <PlusIcon />
        Add Article
    </Button>
    <div class="text-right col-span-2">
        Gesamt:
    </div>
    <div>
        {articles.reduce((acc, article) => acc + article.price, 0)}
    </div>
</div>

<div class="flex flex-col gap-4">
    <h2 class="text-xl">Notizen</h2>
    <Textarea bind:value={notes} />

</div>
    </div>

    <div>

        
    </div>
</div>