import { v } from 'convex/values';
import { Configuration, PlaidApi, Products, type CountryCode } from 'plaid';
import { api } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";
import { getUserId } from "./auth";
import type { Id } from './_generated/dataModel';

const configuration = new Configuration({
    basePath: 'https://sandbox.plaid.com',
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
            'PLAID-SECRET': process.env.PLAID_SECRET!,
        },
    },
});


const plaid = new PlaidApi(configuration);


export const createLinkToken = action({
    handler: async (ctx) => {
        const userId = await getUserId(ctx);

        const response = await plaid.linkTokenCreate({
            client_name: 'LazyBill',
            language: 'de',
            country_codes: ['DE' as CountryCode],
            user: {
                client_user_id: userId,
            },
            redirect_uri: 'http://localhost:5173/app/plaid',
            products: [Products.Transactions],
        });

        return response.data.link_token;
    }
});

export const exchangePublicToken = action({
    args: { publicToken: v.string() },
    handler: async (ctx, { publicToken }) => {
        const userId = await getUserId(ctx);

        // Exchange public token for access token
        const tokenResponse = await plaid.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const accessToken = tokenResponse.data.access_token;
        const itemId = tokenResponse.data.item_id;

        // Get account information
        const accountsResponse = await plaid.accountsGet({
            access_token: accessToken,
        });

        const accounts = accountsResponse.data.accounts;
        const institution = accountsResponse.data.item.institution_id;

        // Store each account in the database
        const accountIds: Id<'bankAccounts'>[] = [];
        for (const account of accounts) {
            const accountId = await ctx.runMutation(api.plaid.createBankAccount, {
                userId,
                accessToken,
                itemId,
                institutionId: institution || undefined,
                accountId: account.account_id,
                accountName: account.name,
                accountMask: account.mask || undefined,
                accountType: account.type,
                accountSubtype: account.subtype || undefined,
            });
            accountIds.push(accountId);
        }

        return { accountIds };
    }
});

export const createBankAccount = mutation({
    args: {
        userId: v.string(),
        accessToken: v.string(),
        itemId: v.string(),
        institutionId: v.optional(v.string()),
        accountId: v.string(),
        accountName: v.optional(v.string()),
        accountMask: v.optional(v.string()),
        accountType: v.optional(v.string()),
        accountSubtype: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert('bankAccounts', args);
    }
});

export const syncTransactions = action({
    args: { bankAccountId: v.id('bankAccounts') },
    handler: async (ctx, { bankAccountId }) => {
        const userId = await getUserId(ctx);

        // Get the bank account
        const bankAccount = await ctx.runQuery(api.plaid.getBankAccount, { bankAccountId });
        if (!bankAccount || bankAccount.userId !== userId) {
            throw new Error('Bank account not found');
        }

        // Fetch transactions from the last 30 days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        const endDate = new Date();

        console.log('Fetching transactions from', startDate.toISOString().split('T')[0], 'to', endDate.toISOString().split('T')[0]);

        try {
            const response = await plaid.transactionsGet({
                access_token: bankAccount.accessToken,
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0],
                options: {
                    account_ids: [bankAccount.accountId],
                },
            });

            const transactions = response.data.transactions;
            console.log(`Found ${transactions.length} transactions from Plaid`);

            // Store transactions in the database
            let created = 0;
            let updated = 0;
            for (const transaction of transactions) {
                const result = await ctx.runMutation(api.plaid.createTransaction, {
                    userId,
                    bankAccountId,
                    transactionId: transaction.transaction_id,
                    amount: transaction.amount,
                    date: transaction.date,
                    name: transaction.name,
                    merchantName: transaction.merchant_name || undefined,
                    category: transaction.category || undefined,
                    pending: transaction.pending,
                });
                if (result.created) created++;
                else updated++;
            }

            console.log(`Created ${created} new transactions, updated ${updated} existing transactions`);
            return { count: transactions.length, created, updated };
        } catch (error) {
            console.error('Error syncing transactions:', error);
            throw error;
        }
    }
});

export const createTransaction = mutation({
    args: {
        userId: v.string(),
        bankAccountId: v.id('bankAccounts'),
        transactionId: v.string(),
        amount: v.number(),
        date: v.string(),
        name: v.string(),
        merchantName: v.optional(v.string()),
        category: v.optional(v.array(v.string())),
        pending: v.boolean(),
    },
    handler: async (ctx, args) => {
        // Check if transaction already exists
        const existing = await ctx.db
            .query('transactions')
            .withIndex('by_bankAccountId', (q) => q.eq('bankAccountId', args.bankAccountId))
            .filter((q) => q.eq(q.field('transactionId'), args.transactionId))
            .first();

        if (existing) {
            // Update existing transaction
            await ctx.db.patch(existing._id, args);
            return { id: existing._id, created: false };
        }

        // Insert new transaction
        const id = await ctx.db.insert('transactions', args);
        return { id, created: true };
    }
});

export const getBankAccount = query({
    args: { bankAccountId: v.id('bankAccounts') },
    handler: async (ctx, { bankAccountId }) => {
        return await ctx.db.get(bankAccountId);
    }
});

export const getBankAccounts = query({
    handler: async (ctx) => {
        const userId = await getUserId(ctx);
        return await ctx.db
            .query('bankAccounts')
            .withIndex('by_userId', (q) => q.eq('userId', userId))
            .collect();
    }
});

export const getTransactions = query({
    args: { bankAccountId: v.id('bankAccounts') },
    handler: async (ctx, { bankAccountId }) => {
        const userId = await getUserId(ctx);
        const bankAccount = await ctx.db.get(bankAccountId);

        if (!bankAccount || bankAccount.userId !== userId) {
            throw new Error('Bank account not found');
        }

        return await ctx.db
            .query('transactions')
            .withIndex('by_bankAccountId', (q) => q.eq('bankAccountId', bankAccountId))
            .order('desc')
            .collect();
    }
});