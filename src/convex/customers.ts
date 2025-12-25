import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const list = query({
    args: {},
    handler: async (ctx) => await ctx.db.query("customers").collect(),
});

export const get = query({
    args: {
        id: v.id('customers'),
    },
    handler: async (ctx, args) => {
        return await ctx.db.get("customers", args.id);
    }
});

export const getFull = query({
    args: {
        id: v.id('customers'),
    },
    handler: async (ctx, args) => {
        const customer = await ctx.db.get("customers", args.id);
        if (!customer) {
            throw new Error("Customer not found");
        }
        return {
            customer,
            invoices: await ctx.db.query("invoices").filter((q) => q.eq(q.field("customerId"), args.id)).collect(),
        };
    }
});

export const create = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const _id = await ctx.db.insert("customers", {
            name: args.name,
            email: "",
            phone: "",
            notes: "",
            isArchived: false,
            invoiceCountry: "",
            invoiceState: "",
            invoiceCity: "",
            invoiceZip: "",
            invoiceStreet: "",
        });
        return { _id };
    }
});

export const update = mutation({
    args: {
        id: v.id('customers'),
        key: v.string(),
        value: v.string(),
    },
    handler: async (ctx, args) => await ctx.db.patch("customers", args.id, {
        [args.key]: args.value,
    })
})