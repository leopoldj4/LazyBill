import { v } from 'convex/values';
import { mutation, query, type QueryCtx } from './_generated/server';
import { getUserId } from './auth';
import type { Id } from './_generated/dataModel';
import { getCompany, getCompanySafe } from './companies';

export async function getCustomer(ctx: QueryCtx, id: Id<'customers'>) {
	const customer = await getCustomerSafe(ctx, id);
	if (!customer) {
		throw new Error('Customer not found');
	}
	return customer;
}

export async function getCustomerSafe(ctx: QueryCtx, id: Id<'customers'>) {
	const userId = await getUserId(ctx);
	const customer = await ctx.db.get(id);
	if (!customer || customer.userId !== userId) {
		return null;
	}
	return customer;
}

export const list = query({
	args: {
		archived: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		const userId = await getUserId(ctx);
		const archived = args.archived ?? false;
		return await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', userId))
			.filter((q) => q.eq(q.field('isArchived'), archived))
			.collect();
	},
});

export const get = query({
	args: {
		id: v.id('customers'),
	},
	handler: async (ctx, args) => await getCustomer(ctx, args.id),
});

export const getFull = query({
	args: {
		id: v.id('customers'),
	},
	handler: async (ctx, args) => {
		const [customer, company, invoices] = await Promise.all([
			getCustomerSafe(ctx, args.id),
			getCompany(ctx),
			ctx.db
				.query('invoices')
				.filter((q) => q.eq(q.field('customerId'), args.id))
				.collect()
		]);

		if (!customer) {
			return null;
		}

		return {
			customer,
			company,
			invoices,
		};
	},
});

export const create = mutation({
	args: {
		name: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await getUserId(ctx);

		const company = await getCompany(ctx);

		const _id = await ctx.db.insert('customers', {
			name: args.name,
			email: '',
			phone: '',
			notes: '',
			isArchived: false,
			invoiceNumberCounter: 0,
			country: '',
			state: '',
			city: '',
			zip: '',
			street: '',
			userId: userId,
			number: company.customerNumberCounter + 1,
		});

		await ctx.db.patch('companies', company._id, {
			customerNumberCounter: company.customerNumberCounter + 1,
		});

		return { _id };
	},
});

export const remove = mutation({
	args: {
		id: v.id('customers'),
	},
	handler: async (ctx, args) => {
		const customer = await getCustomer(ctx, args.id);

		await ctx.db.delete('customers', customer._id);

		const invoices = await ctx.db
			.query('invoices')
			.filter((q) => q.eq(q.field('customerId'), args.id))
			.collect();

		for (const invoice of invoices) {
			await ctx.db.delete('invoices', invoice._id);
		}
	},
});

export const update = mutation({
	args: {
		id: v.id('customers'),
		key: v.string(),
		value: v.string(),
	},
	handler: async (ctx, args) => {
		const customer = await getCustomer(ctx, args.id);

		if (!['email', 'phone', 'notes'].includes(args.key)) {
			throw new Error('Invalid key');
		}
		await ctx.db.patch('customers', customer._id, {
			[args.key]: args.value,
		});
	},
});

export const updateAddress = mutation({
	args: {
		id: v.id('customers'),
		country: v.string(),
		state: v.string(),
		city: v.string(),
		zip: v.string(),
		street: v.string(),
	},
	handler: async (ctx, args) => {
		const customer = await getCustomer(ctx, args.id);
		await ctx.db.patch('customers', customer._id, {
			country: args.country,
			state: args.state,
			city: args.city,
			zip: args.zip,
			street: args.street,
		});
	},
});

export const setArchived = mutation({
	args: {
		id: v.id('customers'),
		archived: v.boolean(),
	},
	handler: async (ctx, args) => {
		const customer = await getCustomer(ctx, args.id);
		await ctx.db.patch('customers', customer._id, {
			isArchived: args.archived,
		});
	},
});