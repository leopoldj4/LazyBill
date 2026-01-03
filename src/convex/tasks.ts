import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query, type QueryCtx } from "./_generated/server";
import { getCompany, getCompanySafe } from "./companies";
import { getCustomer } from "./customers";

export async function getTaskSafe(ctx: QueryCtx, id: Id<'tasks'>) {
    const company = await getCompanySafe(ctx);
    if (!company) {
        return null;
    }
    const task = await ctx.db.get("tasks", id);
    if (!task || task.companyId !== company._id) {
        return null;
    }
    return task;
}

export async function getTask(ctx: QueryCtx, id: Id<'tasks'>) {
    const task = await getTaskSafe(ctx, id);
    if (!task) {
        throw new Error('Task not found');
    }
    return task;
}

export const create = mutation({
    args: {
        customerId: v.id('customers'),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        const company = await getCompany(ctx);
        return await ctx.db.insert('tasks', {
            companyId: company._id,
            customerId: args.customerId,
            description: args.description,
            completed: false,
        });
    }
});

export const list = query({
    args: {
        completed: v.boolean(),
    },
    handler: async (ctx, args) => {
        const company = await getCompany(ctx);
        return await ctx.db.query('tasks').withIndex('by_companyId', (q) => q.eq('companyId', company._id)).filter((q) => q.eq(q.field('completed'), args.completed)).collect();
    }
});

export const setCompleted = mutation({
    args: {
        id: v.id('tasks'),
        completed: v.boolean(),
    },
    handler: async (ctx, args) => {
        const task = await getTask(ctx, args.id);
        return await ctx.db.patch('tasks', task._id, { completed: args.completed });
    }
});

export const remove = mutation({
    args: {
        id: v.id('tasks'),
    },
    handler: async (ctx, args) => {
        const task = await getTask(ctx, args.id);
        return await ctx.db.delete('tasks', task._id);
    }
});

export const updateCustomer = mutation({
    args: {
        id: v.id('tasks'),
        customerId: v.optional(v.id('customers')),
    },
    handler: async (ctx, args) => {
        const task = await getTask(ctx, args.id);
        const customer = args.customerId ? await getCustomer(ctx, args.customerId) : null;
        return await ctx.db.patch('tasks', task._id, { customerId: customer?._id ?? undefined });
    }
});

export const updateDescription = mutation({
    args: {
        id: v.id('tasks'),
        description: v.string(),
    },
    handler: async (ctx, args) => {
        const task = await getTask(ctx, args.id);
        return await ctx.db.patch('tasks', task._id, { description: args.description });
    }
});