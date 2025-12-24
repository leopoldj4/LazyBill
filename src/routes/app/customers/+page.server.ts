import { db } from '$lib/server/db';
import { customer } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function load({ locals }) {
	const userId = locals.user!.id;

	const customers = await db.query.customer.findMany({
		where: eq(customer.userId, userId),
	});

	return { customers };
}
