import { db } from "$lib/server/db";
import { company, customer, invoice, invoiceArticle } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";
import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { redirect } from "@sveltejs/kit";

const schema = z.object({
    customerId: z.string(),
    invoiceNumber: z.string(),
    invoiceDate: z.string(),
    invoiceDueDate: z.string(),
    articles: z.array(z.object({
        name: z.string(),
        quantity: z.number(),
        price: z.number(),
    })).default([{ name: '', quantity: 1, price: 0 }]),
    notes: z.string(),
});

export const load = async ({ locals }) => {
    const form = await superValidate(zod4(schema));
    const userId = locals.user!.id;
    const companyData = await db.query.company.findFirst({
        where: eq(company.userId, userId),
    });
    const customers = await db.query.customer.findMany({
        where: eq(customer.userId, userId),
    });
    return {
        customers,
        form,
        company: companyData,
    };
};

export const actions = {
    default: async ({ request, locals }) => {
        const form = await superValidate(request, zod4(schema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const [invoiceResult] = await db.insert(invoice).values({
            userId: locals.user!.id,
            customerId: form.data.customerId,
            invoiceNumber: form.data.invoiceNumber,
            invoiceDate: form.data.invoiceDate,
            invoiceDueDate: form.data.invoiceDueDate,
            notes: form.data.notes,
        }).returning();

        await db.insert(invoiceArticle).values(form.data.articles.map(article => ({
            invoiceId: invoiceResult.id,
            article: article.name,
            quantity: article.quantity,
            price: article.price,
        })));

        return redirect(302, `/app/invoices/${invoiceResult.id}`);
    }
};