import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { getCompany, getCompanySafe } from "./companies";
import { getCustomer, getCustomerSafe } from "./customers";
import { today } from "$lib/date";
import type { Id } from "./_generated/dataModel";
import { authComponent } from "./auth";

async function getInvoiceSafe(ctx: QueryCtx, id: Id<'invoices'>) {
	const user = await authComponent.getAuthUser(ctx);
	if (!user) {
		return null;
	}
	return await ctx.db.get(id);
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
		const customer = await getCustomerSafe(ctx, invoice.customerId);
		const company = await getCompanySafe(ctx);

		if (!customer || !company) {
			return null;
		}

		return {
			invoice,
			customer,
			company,
		};
	},
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
			state: 'draft',
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