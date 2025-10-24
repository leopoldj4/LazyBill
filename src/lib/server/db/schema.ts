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
	representative: text('representative').notNull().default(""),
	email: text('email').notNull().default(""),
	phone: text('phone').notNull().default(""),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	// Invoice address fields
	invoiceName: text('invoice_name').notNull().default(""),
	invoiceCountry: text('invoice_country').notNull().default(""),
	invoiceState: text('invoice_state').notNull().default(""),
	invoiceCity: text('invoice_city').notNull().default(""),
	invoiceStreet: text('invoice_street').notNull().default(""),
	invoicePhone: text('invoice_phone').notNull().default(""),
	invoiceStreetExtra: text('invoice_street_extra').notNull().default(""),
	invoiceZip: text('invoice_zip').notNull().default(""),
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

export const timeEntry = pgTable("time_entry", {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	taskId: uuid('task_id').references(() => task.id, { onDelete: 'cascade' }),
	startTime: timestamp('start_time').notNull(),
	stopTime: timestamp('stop_time'),
});

export const company = pgTable("company", {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	phone: text('phone').notNull(),
	country: text('country').notNull(),
	state: text('state').notNull(),
	city: text('city').notNull(),
	street: text('street').notNull(),
	streetExtra: text('street_extra').notNull(),
	zip: text('zip').notNull(),
	smallBusiness: boolean('small_business').notNull().default(false),
	bankName: text('bank_name').notNull().default(""),
	bankIban: text('bank_iban').notNull().default(""),
	bankBic: text('bank_bic').notNull().default(""),
	representative: text('representative').notNull().default(""),
	taxNumber: text('tax_number').notNull().default(""),
});

export const userRelations = relations(user, ({ many, one }) => ({
	tasks: many(task),
	invoices: many(invoice),
	customers: many(customer),
	company: one(company),
	timeEntries: many(timeEntry),
}));

export const taskRelations = relations(task, ({ one, many }) => ({
	customer: one(customer, {
		fields: [task.customerId],
		references: [customer.id],
	}),
	timeEntries: many(timeEntry),
	user: one(user, {
		fields: [task.userId],
		references: [user.id],
	}),
}));

export const timeEntryRelations = relations(timeEntry, ({ one }) => ({
	task: one(task, {
		fields: [timeEntry.taskId],
		references: [task.id],
	}),
	user: one(user, {
		fields: [timeEntry.userId],
		references: [user.id],
	}),
}));

export const customerRelations = relations(customer, ({ many, one }) => ({
	tasks: many(task),
	invoices: many(invoice),
	user: one(user, {
		fields: [customer.userId],
		references: [user.id],
	}),
}));

export const invoiceRelations = relations(invoice, ({ many, one }) => ({
	customer: one(customer, {
		fields: [invoice.customerId],
		references: [customer.id],
	}),
	articles: many(invoiceArticle),
	user: one(user, {
		fields: [invoice.userId],
		references: [user.id],
	}),
}));

export const invoiceArticleRelations = relations(invoiceArticle, ({ one }) => ({
	invoice: one(invoice, {
		fields: [invoiceArticle.invoiceId],
		references: [invoice.id],
	}),
}));

export const companyRelations = relations(company, ({ one }) => ({
	user: one(user, {
		fields: [company.userId],
		references: [user.id],
	}),
}));