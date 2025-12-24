import { db } from '$lib/server/db';
import { customer, invoice } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

export async function load({ params, locals }) {
	const userId = locals.user!.id;
	const customerId = params.id;

	// Load customer data
	const customerData = await db.query.customer.findFirst({
		where: and(eq(customer.id, customerId), eq(customer.userId, userId)),
	});

	if (!customerData) {
		throw error(404, 'Customer not found');
	}

	// Load invoices for this customer
	const invoices = await db.query.invoice.findMany({
		where: and(eq(invoice.customerId, customerId), eq(invoice.userId, userId)),
		with: {
			articles: true,
		},
		orderBy: (invoices, { desc }) => [desc(invoices.invoiceDate)],
	});

	return {
		customer: customerData,
		invoices,
	};
}
