import { v } from "convex/values";
import { query } from "./_generated/server";
import { getCustomer } from "./customers";
import { getCompany } from "./companies";

export const getInvoiceContext = query({
	args: {
		id: v.id('customers'),
	},
	handler: async (ctx, args) => {

		const customer = await getCustomer(ctx, args.id);
		const company = await getCompany(ctx);

		if (!customer || !company) {
			return null;
		}

		return {
			customer,
			company,
		};
	},
});