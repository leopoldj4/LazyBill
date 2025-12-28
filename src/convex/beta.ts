import { mutation, query } from "./_generated/server";
import { v } from "convex/values";


export const isBetaUser = query({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const betaUser = await ctx.db
            .query('betaUsers')
            .filter((q) => q.eq(q.field('email'), args.email))
            .first();
        return betaUser !== null;
    }
});

export const addBetaUser = mutation({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert('betaUsers', { email: args.email });
    }
});