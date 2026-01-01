import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { invoiceState } from './invoiceState';

const customers = defineTable({
	userId: v.string(),

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
}).index('by_userId', ['userId']);

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

const betaUsers = defineTable({
	email: v.string(),
});

const bankAccounts = defineTable({
	userId: v.string(),
	accessToken: v.string(),
	itemId: v.string(),
	institutionId: v.optional(v.string()),
	institutionName: v.optional(v.string()),
	accountId: v.string(),
	accountName: v.optional(v.string()),
	accountMask: v.optional(v.string()),
	accountType: v.optional(v.string()),
	accountSubtype: v.optional(v.string()),
}).index('by_userId', ['userId']);

const transactions = defineTable({
	userId: v.string(),
	bankAccountId: v.id('bankAccounts'),
	transactionId: v.string(),
	amount: v.number(),
	date: v.string(),
	name: v.string(),
	merchantName: v.optional(v.string()),
	category: v.optional(v.array(v.string())),
	pending: v.boolean(),
}).index('by_userId', ['userId']).index('by_bankAccountId', ['bankAccountId']);

export default defineSchema({ customers, invoices, companies, betaUsers, bankAccounts, transactions });
