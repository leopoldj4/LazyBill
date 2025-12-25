import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

export const get = query({
    args: {},
    handler: async (ctx, _) => await ctx.db.query("companies").first()
});

export const update = mutation({
    args: {
        key: v.string(),
        value: v.string(),
    },
    handler: async (ctx, args) => {
        const company = await ctx.db.query("companies").first();
        if (!company) {
            throw new Error("Company not found");
        }
        const id = company._id;
        const allowed = ['name', 'phone', 'street', 'zip', 'city', 'state', 'country', 'representative', 'bankName', 'bankIban', 'bankBic', 'smallBusiness', 'taxNumber'];
        if (!allowed.includes(args.key)) {
            throw new Error("Invalid key");
        }

        let value: boolean | string = args.value;
        if (args.key === 'smallBusiness') {
            value = args.value === "true";
        }
        await ctx.db.patch("companies", id, { [args.key]: value });
    }
});