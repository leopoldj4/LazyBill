import { v } from 'convex/values';
import { mutation, query, type QueryCtx } from './_generated/server';
import { authComponent } from './auth';
import { api } from './_generated/api';
import type { Id } from './_generated/dataModel';
import { getCompany } from './companies';

export async function getCustomer(ctx: QueryCtx, id: Id<'customers'>) {
	const customer = await getCustomerSafe(ctx, id);
	if (!customer) {
		throw new Error('Customer not found');
	}
	return customer;
}

export async function getCustomerSafe(ctx: QueryCtx, id: Id<'customers'>) {
	const user = await authComponent.getAuthUser(ctx);
	const customer = await ctx.db.get(id);
	if (!customer || customer.userId !== user._id) {
		return null;
	}
	return customer;
}

export const list = query({
	args: {},
	handler: async (ctx) => {
		const user = await authComponent.getAuthUser(ctx);

		return await ctx.db
			.query('customers')
			.withIndex('by_userId', (q) => q.eq('userId', user._id))
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
		const customer = await getCustomerSafe(ctx, args.id);
		if (!customer) {
			return null;
		}

		return {
			customer,
			invoices: await ctx.db
				.query('invoices')
				.filter((q) => q.eq(q.field('customerId'), args.id))
				.collect(),
		};
	},
});

export const create = mutation({
	args: {
		name: v.string(),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);

		const company = await getCompany(ctx);

		const _id = await ctx.db.insert('customers', {
			name: args.name,
			email: '',
			phone: '',
			notes: '',
			isArchived: false,
			invoiceNumberCounter: 0,
			invoiceCountry: '',
			invoiceState: '',
			invoiceCity: '',
			invoiceZip: '',
			invoiceStreet: '',
			userId: user._id,
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
		await ctx.db.patch('customers', args.id, {
			[args.key]: args.value,
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