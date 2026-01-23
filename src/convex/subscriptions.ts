import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getUserId } from './auth';

export const getSubscription = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getUserId(ctx);
		const subscription = await ctx.db
			.query('subscriptions')
			.withIndex('by_userId', (q) => q.eq('userId', userId))
			.first();

		if (!subscription) {
			return { plan: 'free', status: 'active' };
		}

		return {
			plan: subscription.plan,
			status: subscription.status,
			stripeCustomerId: subscription.stripeCustomerId,
			stripeSubscriptionId: subscription.stripeSubscriptionId,
			currentPeriodEnd: subscription.currentPeriodEnd,
		};
	},
});

export const updateSubscription = mutation({
	args: {
		stripeCustomerId: v.string(),
		stripeSubscriptionId: v.string(),
		plan: v.string(),
		status: v.string(),
		currentPeriodEnd: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const userId = await getUserId(ctx);

		const existing = await ctx.db
			.query('subscriptions')
			.withIndex('by_userId', (q) => q.eq('userId', userId))
			.first();

		if (existing) {
			await ctx.db.patch(existing._id, {
				plan: args.plan,
				status: args.status,
				stripeSubscriptionId: args.stripeSubscriptionId,
				currentPeriodEnd: args.currentPeriodEnd,
			});
		} else {
			await ctx.db.insert('subscriptions', {
				userId,
				stripeCustomerId: args.stripeCustomerId,
				stripeSubscriptionId: args.stripeSubscriptionId,
				plan: args.plan,
				status: args.status,
				currentPeriodEnd: args.currentPeriodEnd,
			});
		}
	},
});

export const updateSubscriptionByStripeId = mutation({
	args: {
		stripeSubscriptionId: v.string(),
		plan: v.optional(v.string()),
		status: v.string(),
		currentPeriodEnd: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		const subscription = await ctx.db
			.query('subscriptions')
			.withIndex('by_stripeSubscriptionId', (q) =>
				q.eq('stripeSubscriptionId', args.stripeSubscriptionId),
			)
			.first();

		if (subscription) {
			await ctx.db.patch(subscription._id, {
				...(args.plan && { plan: args.plan }),
				status: args.status,
				currentPeriodEnd: args.currentPeriodEnd,
			});
		}
	},
});
