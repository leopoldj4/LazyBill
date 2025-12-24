import { db } from '$lib/server/db';
import { company, customer } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load = async ({ params, locals }) => {
	const { id } = params;

	const userId = locals.user!.id;

	const customerResult = await db.query.customer.findFirst({
		where: and(eq(customer.id, id), eq(customer.userId, userId)),
	});

	const companyResult = await db.query.company.findFirst({
		where: eq(company.userId, userId),
	});

	return { customer: customerResult, company: companyResult };
};
