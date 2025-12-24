import { db } from '$lib/server/db';
import { invoice, customer, invoiceArticle } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function load({ locals }) {
	const invoices = await db.query.invoice.findMany({
		where: eq(invoice.userId, locals.user!.id),
		with: {
			articles: true,
			customer: true,
		},
	});

	return {
		invoices,
	};
}
