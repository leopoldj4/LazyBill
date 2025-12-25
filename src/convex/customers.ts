import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { authComponent } from './auth';

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
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);

		const customer = await ctx.db.get(args.id);

		if (!customer || customer.userId !== user._id) {
			return null;
		}

		return customer;
	},
});

export const getFull = query({
	args: {
		id: v.id('customers'),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		const customer = await ctx.db.get('customers', args.id);

		if (!customer || customer.userId !== user._id) {
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

		const _id = await ctx.db.insert('customers', {
			name: args.name,
			email: '',
			phone: '',
			notes: '',
			isArchived: false,
			invoiceCountry: '',
			invoiceState: '',
			invoiceCity: '',
			invoiceZip: '',
			invoiceStreet: '',
			userId: user._id,
		});
		return { _id };
	},
});

export const remove = mutation({
	args: {
		id: v.id('customers'),
	},
	handler: async (ctx, args) => {
		const user = await authComponent.getAuthUser(ctx);
		const customer = await ctx.db.get('customers', args.id);

		if (!customer || customer.userId !== user._id) {
			throw new Error('Customer not found');
		}

		await ctx.db.delete('customers', args.id);

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
		const user = await authComponent.getAuthUser(ctx);

		const customer = await ctx.db.get('customers', args.id);
		if (!customer || customer.userId !== user._id) {
			throw new Error('Customer not found');
		}

		if (!['email', 'phone', 'notes'].includes(args.key)) {
			throw new Error('Invalid key');
		}
		await ctx.db.patch('customers', args.id, {
			[args.key]: args.value,
		});
	},
});
