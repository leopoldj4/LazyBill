import { Migrations } from "@convex-dev/migrations";
import { components, internal } from "./_generated/api.js";
import type { DataModel } from "./_generated/dataModel.js";

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner(internal.migrations.migrateArticlesToNewSchema);

export const convertNumbersToStrings = migrations.define({
    table: "invoices",
    migrateOne: async (_, invoice) => ({
        number: invoice.number.toString(),
    }),
});

export const migrateCustomersToCompany = migrations.define({
    table: "customers",
    migrateOne: async (ctx, customer) => {
        // Get the userId from the customer (old schema)
        const userId = (customer as any).userId as string;
        if (!userId) {
            // Already migrated or no userId
            return {};
        }

        // Find the company that belongs to this user
        const company = await ctx.db
            .query("companies")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        if (!company) {
            console.error(`No company found for customer ${customer._id} with userId ${userId}`);
            return {};
        }

        // Return the update: set companyId and remove userId
        return {
            companyId: company._id,
            userId: undefined,
        };
    },
});

export const migrateArticlesToNewSchema = migrations.define({
    table: "invoices",
    migrateOne: async (_, invoice) => {
        const oldArticles = invoice.articles as Array<{ name: string; price: number; type?: string; units?: string }>;

        // Check if already migrated (first article has type field)
        if (oldArticles.length > 0 && oldArticles[0].type !== undefined) {
            return {};
        }

        const newArticles = oldArticles.map((article) => ({
            type: "items" as const,
            name: article.name,
            units: "1",
            price: article.price,
        }));

        return { articles: newArticles };
    },
});
