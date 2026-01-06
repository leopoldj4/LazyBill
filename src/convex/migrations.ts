import { Migrations } from "@convex-dev/migrations";
import { components, internal } from "./_generated/api.js";
import type { DataModel } from "./_generated/dataModel.js";

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner(internal.migrations.convertNumbersToStrings);

export const convertNumbersToStrings = migrations.define({
    table: "invoices",
    migrateOne: async (_, invoice) => ({
        number: invoice.number.toString(),
    }),
})

