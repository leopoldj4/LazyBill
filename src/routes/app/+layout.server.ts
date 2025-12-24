import { error } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { customer } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const user = {
		name: locals.user.name,
		email: locals.user.email,
		avatar: locals.user.image || '',
	};

	const customers = await db.query.customer.findMany({
		where: eq(customer.userId, locals.user.id),
	});

	return { user, customers };
};
