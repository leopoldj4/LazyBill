import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, boolean, uuid, date, integer } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified')
		.$defaultFn(() => false)
		.notNull(),
	image: text('image'),
	createdAt: timestamp('created_at')
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp('updated_at')
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull(),
	updatedAt: timestamp('updated_at').notNull(),
});

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').$defaultFn(() => /* @__PURE__ */ new Date()),
	updatedAt: timestamp('updated_at').$defaultFn(() => /* @__PURE__ */ new Date()),
});

export const customer = pgTable("customer", {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	street: text('street').notNull().default(""),
	city: text('city').notNull().default(""),
	state: text('state').notNull().default(""),
	zip: text('zip').notNull().default(""),
	country: text('country').notNull().default(""),
	phone: text('phone').notNull().default(""),
	email: text('email').notNull().default(""),
	customerNumber: text('customer_number').notNull().default(""),
	notes: text('notes').notNull().default(""),
});

export const invoice = pgTable("invoice", {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	customerId: uuid('customer_id').references(() => customer.id, { onDelete: 'cascade' }),
	invoiceNumber: text('invoice_number').notNull(),
	invoiceDate: date('invoice_date').notNull(),
	invoiceDueDate: date('invoice_due_date').notNull(),
	notes: text('notes').notNull().default(""),
});

export const invoiceArticle = pgTable("invoice_article", {
	id: uuid('id').primaryKey().defaultRandom(),
	invoiceId: uuid('invoice_id').references(() => invoice.id, { onDelete: 'cascade' }),
	article: text('article').notNull(),
	quantity: integer('quantity').notNull(),
	price: integer('price').notNull(),
});

export const task = pgTable("task", {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	notes: text('notes'),
	done: boolean('done').notNull().default(false),
	dueDate: date('due_date'),
	star: boolean('star').notNull().default(false),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	customerId: uuid('customer_id').references(() => customer.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at'),
});

export const taskRelations = relations(task, ({ one }) => ({
	customer: one(customer, {
		fields: [task.customerId],
		references: [customer.id],
	}),
}));

export const customerRelations = relations(customer, ({ many }) => ({
	tasks: many(task),
}));

export const invoiceRelations = relations(invoice, ({ many, one }) => ({
	customer: one(customer, {
		fields: [invoice.customerId],
		references: [customer.id],
	}),
	articles: many(invoiceArticle),
}));

export const invoiceArticleRelations = relations(invoiceArticle, ({ one }) => ({
	invoice: one(invoice, {
		fields: [invoiceArticle.invoiceId],
		references: [invoice.id],
	}),
}));