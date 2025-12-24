import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod/v4';
import { db } from '$lib/server/db/index.js';
import { eq, sql } from 'drizzle-orm';
import { customer, company } from '$lib/server/db/schema';

const schema = z.object({
	name: z.string(),
	representative: z.string(),
	email: z.string(),
	phone: z.string(),
	notes: z.string(),

	invoiceName: z.string(),
	invoiceCountry: z.string(),
	invoiceState: z.string(),
	invoiceCity: z.string(),
	invoiceStreet: z.string(),
	invoicePhone: z.string(),
	invoiceStreetExtra: z.string(),
	invoiceZip: z.string(),
});

export const load = async () => {
	const form = await superValidate(zod4(schema));

	return { form };
};

export const actions = {
	default: async ({ request, locals }) => {
		const userId = locals.user!.id;

		const form = await superValidate(request, zod4(schema));
		console.log(form);

		if (!form.valid) {
			return fail(400, { form });
		}

		const customerResult = await db.transaction(async (tx) => {
			const [updatedCompany] = await tx
				.update(company)
				.set({
					customerNumberCounter: sql`${company.customerNumberCounter} + 1`,
				})
				.where(eq(company.userId, userId))
				.returning({ counter: company.customerNumberCounter });

			if (!updatedCompany) {
				throw new Error('Company not found');
			}

			const [newCustomer] = await tx
				.insert(customer)
				.values({
					userId,
					customerNumber: updatedCompany.counter - 1,
					...form.data,
				})
				.returning();

			return newCustomer;
		});

		console.log(customerResult.id);

		return redirect(302, `/app/customers/${customerResult.id}`);
	},
};
