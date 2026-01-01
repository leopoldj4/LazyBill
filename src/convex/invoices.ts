import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { getCompany, getCompanySafe } from "./companies";
import { getCustomer, getCustomerSafe } from "./customers";
import { today } from "$lib/date";
import type { Id } from "./_generated/dataModel";
import { invoiceState } from "./invoiceState";
import { getUserId } from "./auth";

async function getInvoiceSafe(ctx: QueryCtx, id: Id<'invoices'>) {
	const company = await getCompanySafe(ctx);
	const invoice = await ctx.db.get(id);
	if (!invoice || invoice.companyId !== company?._id) {
		return null;
	}
	return invoice;
}

async function getInvoice(ctx: QueryCtx, id: Id<'invoices'>) {
	const invoice = await getInvoiceSafe(ctx, id);
	if (!invoice) {
		throw new Error('Invoice not found');
	}
	return invoice;
}

export const getFull = query({
	args: {
		id: v.id('invoices'),
	},
	handler: async (ctx, args) => {
		const invoice = await ctx.db.get("invoices", args.id);
		if (!invoice) {
			return null;
		}

		const [customer, company, file] = await Promise.all([
			getCustomerSafe(ctx, invoice.customerId),
			getCompanySafe(ctx),
			invoice.file ? ctx.storage.getUrl(invoice.file) : Promise.resolve(null),
		]);

		if (!customer || !company) {
			return null;
		}

		return {
			invoice,
			customer,
			company,
			file,
		};
	},
})

export const list = query({
	args: {},
	handler: async (ctx, args) => {
		const company = await getCompany(ctx);
		const invoices = await ctx.db.query('invoices').withIndex('by_companyId', (q) => q.eq('companyId', company._id)).collect();
		
		return await Promise.all(invoices.map(async (invoice) => {
			const customer = await ctx.db.get(invoice.customerId);
			return {
				...invoice,
				customer,
			};
		}));
	}
})

export const createInvoice = mutation({
	args: {
		customerId: v.id('customers'),
	},
	handler: async (ctx, args) => {
		const customer = await getCustomer(ctx, args.customerId);
		const company = await getCompany(ctx);

		const invoice = await ctx.db.insert('invoices', {
			customerId: customer._id,
			companyId: company._id,
			number: (customer.invoiceNumberCounter + 1).toString(),
			date: today(),
			dueInDays: 30,
			articles: [{ name: '', price: 0 }],
			notes: '',
			state: 'new',
		});

		await ctx.db.patch('customers', customer._id, {
			invoiceNumberCounter: customer.invoiceNumberCounter + 1,
		});

		return invoice;
	}
})

export const deleteInvoice = mutation({
	args: {
		id: v.id('invoices'),
	},
	handler: async (ctx, args) => {
		const invoice = await getInvoice(ctx, args.id);
		await ctx.db.delete('invoices', invoice._id);
	}
})

export const updateInvoiceState = mutation({
	args: {
		id: v.id('invoices'),
		state: invoiceState,
	},
	handler: async (ctx, args) => {
		const invoice = await getInvoice(ctx, args.id);
		await ctx.db.patch('invoices', invoice._id, {
			state: args.state,
		});
	}
})

export const updateInvoice = mutation({
	args: {
		id: v.id('invoices'),
		articles: v.array(v.object({ name: v.string(), price: v.number() })),
		notes: v.string(),
		dueInDays: v.number(),
		date: v.string(),
		state: v.optional(invoiceState),
		file: v.optional(v.id('_storage')),
	},
	handler: async (ctx, args) => {
		const invoice = await getInvoice(ctx, args.id);
		await ctx.db.patch('invoices', invoice._id, {
			articles: args.articles,
			notes: args.notes,
			dueInDays: args.dueInDays,
			date: args.date,
			state: args.state || invoice.state,
			file: args.file,
		});
	}
})

export const generateUploadUrl = mutation({
	args: {},
	handler: async (ctx) => {
		return await ctx.storage.generateUploadUrl();
	},
})