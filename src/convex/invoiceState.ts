import { v, type Infer } from "convex/values";

export const invoiceState = v.union(
    v.literal('new'),
    v.literal('sent'),
    v.literal('paid'),
    v.literal('cancelled'),
);

export type InvoiceState = Infer<typeof invoiceState>;