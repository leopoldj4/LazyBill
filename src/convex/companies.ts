import { v } from 'convex/values';
import { mutation, query, type QueryCtx } from './_generated/server';
import { authComponent } from './auth';

export async function getCompany(ctx: QueryCtx) {
	const user = await authComponent.getAuthUser(ctx);
	return await ctx.db
		.query('companies')
		.withIndex('by_userId', (q) => q.eq('userId', user._id))
		.first();
}

export const get = query({
	args: {},
	handler: getCompany,
});

export const update = mutation({
	args: {
		key: v.string(),
		value: v.string(),
	},
	handler: async (ctx, args) => {
		const company = await getCompany(ctx);

		if (!company) {
			throw new Error('Company not found');
		}

		const allowed = [
			'name',
			'phone',
			'street',
			'zip',
			'city',
			'state',
			'country',
			'representative',
			'bankName',
			'bankIban',
			'bankBic',
			'smallBusiness',
			'taxNumber',
		];
		if (!allowed.includes(args.key)) {
			throw new Error('Invalid key');
		}

		let value: boolean | string = args.value;
		if (args.key === 'smallBusiness') {
			value = args.value === 'true';
		}

		const id = company._id;
		await ctx.db.patch('companies', id, { [args.key]: value });
	},
});
