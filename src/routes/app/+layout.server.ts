import type { SidebarUser } from '$lib/components/sidebar-user';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, 'Unauthorized');
	}

	const user: SidebarUser = {
		name: locals.user.name,
		email: locals.user.email,
		avatar: locals.user.image || '',
	};

	return { user };
};
