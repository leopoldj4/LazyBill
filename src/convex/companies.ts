import { v } from 'convex/values';
import { mutation, query, type QueryCtx } from './_generated/server';
import { getUserId } from './auth';
import type { Id } from './_generated/dataModel';

export async function getCompany(ctx: QueryCtx, id: Id<'companies'>) {
	const company = await getCompanySafe(ctx, id);
	if (!company) {
		throw new Error('Company not found');
	}
	return company;
}

export async function getCompanySafe(ctx: QueryCtx, id: Id<'companies'>) {
	const userId = await getUserId(ctx);
	const company = await ctx.db.get('companies', id);
	if (!company || company.userId !== userId) {
		return null;
	}
	return company;
}

export const getCompanies = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getUserId(ctx);
		return await ctx.db.query('companies').withIndex('by_userId', (q) => q.eq('userId', userId)).collect();
	},
});

export const get = query({
	args: { id: v.id('companies') },
	handler: async (ctx, args) => {
		return await getCompany(ctx, args.id);
	},
});

export const update = mutation({
	args: {
		id: v.id('companies'),
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
		const company = await getCompany(ctx, args.id);

		await ctx.db.patch('companies', company._id, { ...args });
	},
});

export const updateField = mutation({
	args: {
		id: v.id('companies'),
		field: v.string(),
		value: v.union(v.string(), v.boolean()),
	},
	handler: async (ctx, args) => {
		const company = await getCompany(ctx, args.id);
		if (!['name', 'phone', 'street', 'zip', 'city', 'state', 'country', 'representative', 'bankName', 'bankIban', 'bankBic', 'smallBusiness', 'taxNumber'].includes(args.field)) {
			throw new Error('Invalid field');
		}
		await ctx.db.patch('companies', company._id, { [args.field]: args.value });
	},
});

export const updateAddress = mutation({
	args: {
		id: v.id('companies'),
		street: v.string(),
		zip: v.string(),
		city: v.string(),
		state: v.string(),
		country: v.string(),
	},
	handler: async (ctx, args) => {
		const company = await getCompany(ctx, args.id);
		await ctx.db.patch('companies', company._id, {
			street: args.street,
			zip: args.zip,
			city: args.city,
			state: args.state,
			country: args.country,
		});
	},
});

export const create = mutation({
	args: { name: v.string() },
	handler: async (ctx, args) => {
		const userId = await getUserId(ctx);
		return await ctx.db.insert('companies', { userId, name: args.name, phone: '', country: '', state: '', city: '', zip: '', street: '', representative: '', bankName: '', bankIban: '', bankBic: '', smallBusiness: false, taxNumber: '', customerNumberCounter: 0 });
	},
});	

export const remove = mutation({
	args: { id: v.id('companies') },
	handler: async (ctx, args) => {
		const company = await getCompany(ctx, args.id);
		await ctx.db.delete('companies', company._id);
	},
});

export const getTotalCustomerCount = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getUserId(ctx);
		const companies = await ctx.db
			.query('companies')
			.withIndex('by_userId', (q) => q.eq('userId', userId))
			.collect();

		let totalCustomers = 0;
		for (const company of companies) {
			const customers = await ctx.db
				.query('customers')
				.withIndex('by_companyId', (q) => q.eq('companyId', company._id))
				.filter((q) => q.eq(q.field('isArchived'), false))
				.collect();
			totalCustomers += customers.length;
		}

		return totalCustomers;
	},
});