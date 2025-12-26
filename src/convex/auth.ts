import { createClient, type GenericCtx } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { v } from 'convex/values';
import { components, internal } from './_generated/api';
import type { DataModel } from './_generated/dataModel';
import { internalMutation, query } from './_generated/server';
import { betterAuth } from 'better-auth/minimal';
import authConfig from './auth.config';

const siteUrl = process.env.SITE_URL!;

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createCompanyForUser = internalMutation({
	args: {
		userId: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert('companies', {
			userId: args.userId,
			name: '',
			phone: '',
			street: '',
			zip: '',
			city: '',
			state: '',
			country: '',
			representative: '',
			bankName: '',
			bankIban: '',
			bankBic: '',
			smallBusiness: false,
			taxNumber: '',
			customerNumberCounter: 0,
		});
	},
});

export const createAuth = (ctx: GenericCtx<DataModel>) => {
	return betterAuth({
		baseURL: siteUrl,
		database: authComponent.adapter(ctx),
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
		},
		plugins: [convex({ authConfig })],
		databaseHooks: {
			user: {
				create: {
					after: async (user) => {
						if ('runMutation' in ctx) {
							await ctx.runMutation(internal.auth.createCompanyForUser, {
								userId: user.id,
							});
						}
					},
				},
			},
		},
	});
};

export const getCurrentUser = query({
	args: {},
	handler: async (ctx) => {
		try {
			const user = await authComponent.getAuthUser(ctx);
			return user;
		} catch (error) {
			console.error(error);
			return null;
		}
	},
});
