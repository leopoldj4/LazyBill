import { action, internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { Resend } from "resend";


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

// Internal mutation to insert beta user into database
export const insertBetaUser = internalMutation({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query('betaUsers')
            .filter((q) => q.eq(q.field('email'), args.email))
            .first();
        if (!existing) {
            await ctx.db.insert('betaUsers', { email: args.email });
        }
    }
});

// Action can make external HTTP requests (like Resend API)
export const addBetaUser = action({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const auth = await authComponent.getAuthUser(ctx);
        if (auth.email != "mail@leoj.de") {
            throw new Error("You are not authorized to add beta users");
        }

        // Insert beta user via internal mutation
        await ctx.runMutation(internal.beta.insertBetaUser, { email: args.email });

        // Send email via Resend (actions can make HTTP requests)
        const resend = new Resend(process.env.RESEND_API_KEY!);
        const result = await resend.emails.send({
            from: "LazyBill <noreply@updates.lazybill.app>",
            to: [args.email],
            subject: "You are invited to the LazyBill beta",
            html: "<p>You can now access the beta version of LazyBill.</p><p>Please click the link below to register:</p><a href='https://beta.lazybill.app/sign-up'>Sign up</a>",
        });
        if (result.error) {
            throw new Error("Failed to send email");
        }
    }
});

export const listBetaUsers = query({
    handler: async (ctx) => {
        const auth = await authComponent.getAuthUser(ctx);
        if (auth.email != "mail@leoj.de") {
            throw new Error("You are not authorized to list beta users");
        }

        return await ctx.db.query('betaUsers').collect();
    }
});