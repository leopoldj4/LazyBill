import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

const customers = defineTable({
	userId: v.string(),

	number: v.number(),

	name: v.string(),
	email: v.string(),
	phone: v.string(),
	notes: v.string(),

	isArchived: v.boolean(),

	invoiceNumberCounter: v.number(),
	invoiceCountry: v.string(),
	invoiceState: v.string(),
	invoiceCity: v.string(),
	invoiceZip: v.string(),
	invoiceStreet: v.string(),
}).index('by_userId', ['userId']);

const invoices = defineTable({
	customerId: v.id('customers'),
	companyId: v.id('companies'),

	state: v.union(v.literal('draft'), v.literal('sent'), v.literal('paid'), v.literal('cancelled')),

	number: v.number(),
	date: v.string(), // yr-mon-day
	dueInDays: v.number(),
	articles: v.array(
		v.object({
			name: v.string(),
			price: v.number(),
		}),
	),
	notes: v.string(),
});

const companies = defineTable({
	userId: v.string(),

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
}).index('by_userId', ['userId']);

export default defineSchema({ customers, invoices, companies });
