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

	const customer = await ctx.db.get("customers", id);
	if (!customer) {
		return null;
	}
	const company = await getCompanySafe(ctx, customer.companyId);
	if (!company) {
		return null;
	}
	return customer;
}

export const list = query({
	args: {
		companyId: v.id('companies'),
		archived: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		const company = await getCompany(ctx, args.companyId);
		const archived = args.archived ?? false;
		return await ctx.db
			.query('customers')
			.withIndex('by_companyId', (q) => q.eq('companyId', company._id))
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
		const [customer, invoices] = await Promise.all([
			getCustomerSafe(ctx, args.id),

			ctx.db
				.query('invoices')
				.filter((q) => q.eq(q.field('customerId'), args.id))
				.collect()
		]);

		if (!customer) {
			return null;
		}

		const company = await getCompanySafe(ctx, customer.companyId);
		if (!company) {
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
		companyId: v.id('companies'),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await getUserId(ctx);

		const company = await getCompany(ctx, args.companyId);

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
			companyId: company._id,
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

		if (!['email', 'phone', 'notes', 'name'].includes(args.key)) {
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

export const updateContact = mutation({
	args: {
		id: v.id('customers'),
		email: v.string(),
		phone: v.string(),
	},
	handler: async (ctx, args) => {
		const customer = await getCustomer(ctx, args.id);
		await ctx.db.patch('customers', customer._id, {
			email: args.email,
			phone: args.phone,
		});
	},
});