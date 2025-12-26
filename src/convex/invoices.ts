import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCompany, getCompanySafe } from "./companies";
import { getCustomer, getCustomerSafe } from "./customers";
import { today } from "$lib/date";
import { invoiceID } from "$lib";

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

		const invoiceNumber = invoiceID(invoice.number, customer.number);

		return {
			invoiceNumber,
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
			number: customer.invoiceNumberCounter + 1,
			date: today(),
			dueInDays: 30,
			articles: [],
			notes: '',
			state: 'draft',
		});

		await ctx.db.patch('customers', customer._id, {
			invoiceNumberCounter: customer.invoiceNumberCounter + 1,
		});

		return invoice;
	}
})