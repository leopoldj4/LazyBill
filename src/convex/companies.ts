import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { authComponent } from './auth';

export const get = query({
	args: {},
	handler: async (ctx) => {
		const user = await authComponent.getAuthUser(ctx);

		return await ctx.db
			.query('companies')
			.withIndex('by_userId', (q) => q.eq('userId', user._id))
			.first();
	},
});

export const update = mutation({
	args: {
		key: v.string(),
		value: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);

		const company = await ctx.db
			.query('companies')
			.withIndex('by_userId', (q) => q.eq('userId', user._id))
			.first();

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
