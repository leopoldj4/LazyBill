import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { invoiceState } from './invoiceState';

const customers = defineTable({
	companyId: v.id('companies'),

	number: v.number(),

	name: v.string(),
	email: v.string(),
	phone: v.string(),
	notes: v.string(),

	isArchived: v.boolean(),

	invoiceNumberCounter: v.number(),
	country: v.string(),
	state: v.string(),
	city: v.string(),
	zip: v.string(),
	street: v.string(),
}).index('by_companyId', ['companyId']);

const invoices = defineTable({
	customerId: v.id('customers'),
	companyId: v.id('companies'),

	state: invoiceState,

	number: v.string(),
	date: v.string(), // yr-mon-day
	dueInDays: v.number(),
	articles: v.array(
		v.object({
			name: v.string(),
			price: v.number(),
		}),
	),
	notes: v.string(),

	file: v.optional(v.id('_storage')),
}).index('by_companyId', ['companyId']);

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

const tasks = defineTable({
	companyId: v.id('companies'),
	customerId: v.optional(v.id('customers')),
	invoiceId: v.optional(v.id('invoices')),

	description: v.string(),
	completed: v.boolean(),
}).index('by_companyId', ['companyId']);

const timeEntries = defineTable({
	companyId: v.id('companies'),
	customerId: v.optional(v.id('customers')),
	invoiceId: v.optional(v.id('invoices')),

	description: v.string(),
	startDateTime: v.string(), // ISO datetime string (YYYY-MM-DDTHH:mm)
	endDateTime: v.optional(v.string()), // ISO datetime string (YYYY-MM-DDTHH:mm)
}).index('by_companyId', ['companyId']);

const betaUsers = defineTable({
	email: v.string(),
});

const feedback = defineTable({
	userId: v.string(),
	message: v.string(),
});

const subscriptions = defineTable({
	userId: v.string(),
	stripeCustomerId: v.string(),
	stripeSubscriptionId: v.string(),
	plan: v.string(),
	status: v.string(),
	currentPeriodEnd: v.optional(v.number()),
})
	.index('by_userId', ['userId'])
	.index('by_stripeSubscriptionId', ['stripeSubscriptionId']);

export default defineSchema({ customers, invoices, companies, betaUsers, tasks, timeEntries, feedback, subscriptions });
