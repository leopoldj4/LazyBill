import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { getCompany, getCompanySafe } from "./companies";
import { getCustomer } from "./customers";
import { getInvoice } from "./invoices";

export async function getTimeEntrySafe(ctx: QueryCtx, id: Id<'timeEntries'>) {
    const timeEntry = await ctx.db.get(id);
    if (!timeEntry) {
        return null;
    }
    const company = await getCompanySafe(ctx, timeEntry.companyId);
    if (!company || timeEntry.companyId !== company._id) {
        return null;
    }
    return timeEntry;
}

export async function getTimeEntry(ctx: QueryCtx, id: Id<'timeEntries'>) {
    const timeEntry = await getTimeEntrySafe(ctx, id);
    if (!timeEntry) {
        throw new Error('Time entry not found');
    }
    return timeEntry;
}

export const create = mutation({
    args: {
        customerId: v.optional(v.id("customers")),
        companyId: v.id('companies'),
        invoiceId: v.optional(v.id('invoices')),
        description: v.string(),
        startDateTime: v.string(),
        endDateTime: v.string(),
    },
    handler: async (ctx, args) => {
        const company = await getCompany(ctx, args.companyId);

        if (args.customerId) {
            await getCustomer(ctx, args.customerId);
        }
        if (args.invoiceId) {
            await getInvoice(ctx, args.invoiceId);
        }

        return await ctx.db.insert('timeEntries', {
            companyId: company._id,
            customerId: args.customerId,
            invoiceId: args.invoiceId,
            description: args.description,
            startDateTime: args.startDateTime,
            endDateTime: args.endDateTime,
        });
    }
});

export const list = query({
    args: {
        companyId: v.id('companies'),
    },
    handler: async (ctx, args) => {
        const company = await getCompany(ctx, args.companyId);
        return await ctx.db
            .query('timeEntries')
            .withIndex('by_companyId', (q) => q.eq('companyId', company._id))
            .collect();
    }
});

export const listOpen = query({
    args: {
        companyId: v.id('companies'),
    },
    handler: async (ctx, args) => {
        const company = await getCompany(ctx, args.companyId);
        return await ctx.db
            .query('timeEntries')
            .withIndex('by_companyId', (q) => q.eq('companyId', company._id))
            .filter((q) => q.eq(q.field('invoiceId'), undefined))
            .collect();
    }
});

export const update = mutation({
    args: {
        id: v.id('timeEntries'),
        customerId: v.optional(v.id('customers')),
        invoiceId: v.optional(v.id('invoices')),
        description: v.optional(v.string()),
        startDateTime: v.optional(v.string()),
        endDateTime: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const timeEntry = await getTimeEntry(ctx, args.id);

        if (args.customerId) {
            await getCustomer(ctx, args.customerId);
        }
        if (args.invoiceId) {
            await getInvoice(ctx, args.invoiceId);
        }

        const updates: Partial<{
            customerId: Id<'customers'> | undefined;
            invoiceId: Id<'invoices'> | undefined;
            description: string;
            startDateTime: string;
            endDateTime: string;
        }> = {};

        if (args.customerId !== undefined) updates.customerId = args.customerId || undefined;
        if (args.invoiceId !== undefined) updates.invoiceId = args.invoiceId || undefined;
        if (args.description !== undefined) updates.description = args.description;
        if (args.startDateTime !== undefined) updates.startDateTime = args.startDateTime;
        if (args.endDateTime !== undefined) updates.endDateTime = args.endDateTime;

        return await ctx.db.patch(timeEntry._id, updates);
    }
});

export const updateCustomer = mutation({
    args: {
        id: v.id('timeEntries'),
        customerId: v.optional(v.id('customers')),
    },
    handler: async (ctx, args) => {
        const timeEntry = await getTimeEntry(ctx, args.id);
        if (args.customerId) {
            await getCustomer(ctx, args.customerId);
        }
        return await ctx.db.patch(timeEntry._id, { customerId: args.customerId ?? undefined });
    }
});

export const updateInvoice = mutation({
    args: {
        id: v.id('timeEntries'),
        invoiceId: v.optional(v.id('invoices')),
    },
    handler: async (ctx, args) => {
        const timeEntry = await getTimeEntry(ctx, args.id);
        if (args.invoiceId) {
            await getInvoice(ctx, args.invoiceId);
        }
        return await ctx.db.patch(timeEntry._id, { invoiceId: args.invoiceId ?? undefined });
    }
});

export const remove = mutation({
    args: {
        id: v.id('timeEntries'),
    },
    handler: async (ctx, args) => {
        const timeEntry = await getTimeEntry(ctx, args.id);
        return await ctx.db.delete(timeEntry._id);
    }
});

export const getRunning = query({
    args: {
        companyId: v.id('companies'),
    },
    handler: async (ctx, args) => {
        const company = await getCompanySafe(ctx, args.companyId);
        if (!company) return [];

        const entries = await ctx.db
            .query('timeEntries')
            .withIndex('by_companyId', (q) => q.eq('companyId', company._id))
            .collect();

        // Running entries have no endDateTime
        return entries.filter((e) => !e.endDateTime);
    }
});

export const start = mutation({
    args: {
        customerId: v.optional(v.id('customers')),
        description: v.string(),
        startDateTime: v.string(),
        companyId: v.id('companies'),
    },
    handler: async (ctx, args) => {
        const company = await getCompany(ctx, args.companyId);

        if (args.customerId) {
            await getCustomer(ctx, args.customerId);
        }

        return await ctx.db.insert('timeEntries', {
            companyId: company._id,
            customerId: args.customerId,
            description: args.description,
            startDateTime: args.startDateTime,
        });
    }
});

export const stop = mutation({
    args: {
        id: v.id('timeEntries'),
        endDateTime: v.string(),
    },
    handler: async (ctx, args) => {
        const timeEntry = await getTimeEntry(ctx, args.id);

        if (timeEntry.endDateTime) {
            throw new Error('Time entry is already stopped');
        }

        return await ctx.db.patch(timeEntry._id, {
            endDateTime: args.endDateTime,
        });
    }
});
