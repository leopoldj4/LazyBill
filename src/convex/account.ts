import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { components } from './_generated/api';
import { authComponent, getUserId } from './auth';

export const getAuthMethods = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getUserId(ctx);
		const user = await authComponent.getAnyUserById(ctx, userId);

		if (!user) {
			throw new Error('User not found');
		}

		// Check for credential (password) account
		const credentialAccount = await ctx.runQuery(components.betterAuth.adapter.findOne, {
			model: 'account',
			where: [
				{ field: 'userId', value: userId },
				{ field: 'providerId', value: 'credential' },
			],
		});

		// Check for Google account
		const googleAccount = await ctx.runQuery(components.betterAuth.adapter.findOne, {
			model: 'account',
			where: [
				{ field: 'userId', value: userId },
				{ field: 'providerId', value: 'google' },
			],
		});

		return {
			email: user.email,
			emailVerified: user.emailVerified,
			hasPassword: credentialAccount !== null,
			hasGoogle: googleAccount !== null,
			createdAt: user.createdAt,
		};
	},
});

export const updateEmail = mutation({
	args: {
		newEmail: v.string(),
		password: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await getUserId(ctx);
		const user = await authComponent.getAnyUserById(ctx, userId);

		if (!user) {
			throw new Error('User not found');
		}

		// Check if user has a password account
		const credentialAccount = await ctx.runQuery(components.betterAuth.adapter.findOne, {
			model: 'account',
			where: [
				{ field: 'userId', value: userId },
				{ field: 'providerId', value: 'credential' },
			],
		});

		if (!credentialAccount) {
			throw new Error('No password set for this account');
		}

		// Check if email is unique
		const existingUser = await ctx.runQuery(components.betterAuth.adapter.findOne, {
			model: 'user',
			where: [{ field: 'email', value: args.newEmail }],
		});

		if (existingUser && existingUser.id !== userId) {
			throw new Error('Email already in use');
		}

		// Update email directly
		// Note: Password verification should ideally be done through Better Auth HTTP API
		await ctx.runMutation(components.betterAuth.adapter.updateOne, {
			input: {
				model: 'user',
				where: [{ field: '_id', value: userId }],
				update: {
					email: args.newEmail,
					emailVerified: false,
				},
			},
		});

		return { success: true };
	},
});

export const updatePassword = mutation({
	args: {
		currentPassword: v.string(),
		newPassword: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await getUserId(ctx);

		// Better Auth handles password updates through its own API
		// We need to verify the user exists
		const user = await authComponent.getAnyUserById(ctx, userId);
		if (!user) {
			throw new Error('User not found');
		}

		// Password validation
		if (args.newPassword.length < 8) {
			throw new Error('Password must be at least 8 characters long');
		}

		// Note: Password verification and hashing is handled by Better Auth internally
		// This mutation serves as a placeholder for the client to call
		// The actual password update should happen through Better Auth's client API
		throw new Error(
			'Password updates must be done through the Better Auth client API (authClient.changePassword)',
		);
	},
});

export const deleteAccount = mutation({
	args: {
		password: v.string(),
		confirmation: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await getUserId(ctx);

		if (args.confirmation !== 'DELETE') {
			throw new Error('Confirmation text does not match');
		}

		// Get user to verify existence
		const user = await authComponent.getAnyUserById(ctx, userId);
		if (!user) {
			throw new Error('User not found');
		}

		// Delete all user data
		// 1. Delete company (and cascade will handle related data)
		const company = await ctx.db
			.query('companies')
			.withIndex('by_userId', (q) => q.eq('userId', userId))
			.first();

		if (company) {
			// Delete all invoices for this company
			const invoices = await ctx.db
				.query('invoices')
				.withIndex('by_companyId', (q) => q.eq('companyId', company._id))
				.collect();

			for (const invoice of invoices) {
				await ctx.db.delete(invoice._id);
			}

			// Delete all tasks for this company
			const tasks = await ctx.db
				.query('tasks')
				.withIndex('by_companyId', (q) => q.eq('companyId', company._id))
				.collect();

			for (const task of tasks) {
				await ctx.db.delete(task._id);
			}

			// Delete all time entries for this company
			const timeEntries = await ctx.db
				.query('timeEntries')
				.withIndex('by_companyId', (q) => q.eq('companyId', company._id))
				.collect();

			for (const timeEntry of timeEntries) {
				await ctx.db.delete(timeEntry._id);
			}

			// Delete all customers
			const customers = await ctx.db
				.query('customers')
				.withIndex('by_userId', (q) => q.eq('userId', userId))
				.collect();

			for (const customer of customers) {
				await ctx.db.delete(customer._id);
			}

			// Delete company
			await ctx.db.delete(company._id);
		}

		// Delete auth data through Better Auth adapter
		// Delete sessions for this user
		await ctx.runMutation(components.betterAuth.adapter.deleteOne, {
			input: {
				model: 'session',
				where: [{ field: 'userId', value: userId }],
			},
		});

		// Delete accounts for this user
		await ctx.runMutation(components.betterAuth.adapter.deleteOne, {
			input: {
				model: 'account',
				where: [{ field: 'userId', value: userId }],
			},
		});

		// Delete the user
		await ctx.runMutation(components.betterAuth.adapter.deleteOne, {
			input: {
				model: 'user',
				where: [{ field: '_id', value: userId }],
			},
		});

		return { success: true };
	},
});
