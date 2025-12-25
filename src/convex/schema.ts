import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const customers = defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.string(),
    notes: v.string(),

    isArchived: v.boolean(),

    invoiceCountry: v.string(),
    invoiceState: v.string(),
    invoiceCity: v.string(),
    invoiceZip: v.string(),
    invoiceStreet: v.string(),
});

const invoices = defineTable({
    customerId: v.id('customers'),
    number: v.number(),
    date: v.string(), // yr-mon-day
    dueInDays: v.number(),
    articles: v.array(v.object({
        name: v.string(),
        price: v.number(),
    })),
    notes: v.string(),
});

const companies = defineTable({
    name: v.string(),
    phone: v.string(),

    street: v.string(),
    zip: v.string(),
    city: v.string(),
    state: v.string(),
    country: v.string(),

    representative: v.string(),
    bankName: v.string(),
    bankIban: v.string(),
    bankBic: v.string(),
    
    smallBusiness: v.boolean(),
    taxNumber: v.string(),

    customerNumberCounter: v.number(),
    invoiceNumberCounter: v.number(),
});

export default defineSchema({ customers, invoices, companies })