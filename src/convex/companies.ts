import { v } from 'convex/values';
import { mutation, query, type QueryCtx } from './_generated/server';
import { getUserId } from './auth';

export async function getCompany(ctx: QueryCtx) {
	const company = await getCompanySafe(ctx);
	if (!company) {
		throw new Error('Company not found');
	}
	return company;
}

export async function getCompanySafe(ctx: QueryCtx) {
	const userId = await getUserId(ctx);

	return await ctx.db
		.query('companies')
		.withIndex('by_userId', (q) => q.eq('userId', userId))
		.first();
}

export const get = query({
	args: {},
	handler: getCompany,
});

export const update = mutation({
	args: {
		name: v.string(),
		phone: v.string(),
		street: v.string(),
		zip: v.string(),
		city: v.string(),
		state: v.string(),
		country: v.string(),
		representative: v.string(),
		bankName: v.string(),
		bankIban: v.string(),
		bankBic: v.string(),
		smallBusiness: v.boolean(),
		taxNumber: v.string(),
	},
	handler: async (ctx, args) => {
		const company = await getCompany(ctx);

		await ctx.db.patch('companies', company._id, { ...args });
	},
});

export const updateField = mutation({
	args: {
		field: v.string(),
		value: v.union(v.string(), v.boolean()),
	},
	handler: async (ctx, args) => {
		const company = await getCompany(ctx);
		if (!['name', 'phone', 'street', 'zip', 'city', 'state', 'country', 'representative', 'bankName', 'bankIban', 'bankBic', 'smallBusiness', 'taxNumber'].includes(args.field)) {
			throw new Error('Invalid field');
		}
		await ctx.db.patch('companies', company._id, { [args.field]: args.value });
	},
});

export const updateAddress = mutation({
	args: {
		street: v.string(),
		zip: v.string(),
		city: v.string(),
		state: v.string(),
		country: v.string(),
	},
	handler: async (ctx, args) => {
		const company = await getCompany(ctx);
		await ctx.db.patch('companies', company._id, {
			street: args.street,
			zip: args.zip,
			city: args.city,
			state: args.state,
			country: args.country,
		});
	},
});