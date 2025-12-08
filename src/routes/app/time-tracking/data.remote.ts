import * as v from 'zod/v4';
import { query, command } from '$app/server';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { timeEntry, customer } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

// Query to get all time entries for the current user
export const getTimeEntries = query(async () => {
	const { locals } = getRequestEvent();
	const userId = locals.user!.id;

	const entries = await db.query.timeEntry.findMany({
		where: eq(timeEntry.userId, userId),
		orderBy: [desc(timeEntry.startTime)],
		with: {
			customer: true
		}
	});

	return entries;
});

// Query to get all customers for the current user
export const getCustomers = query(async () => {
	const { locals } = getRequestEvent();
	const userId = locals.user!.id;

	const customers = await db.query.customer.findMany({
		where: eq(customer.userId, userId),
	});

	return customers;
});

// Schema for saving a time entry from the timer
const saveTimeEntrySchema = v.object({
	description: v.string(),
	customerId: v.nullable(v.string()),
	startTime: v.iso.datetime(),
	stopTime: v.iso.datetime(),
});

// Command to save a time entry (when stopping the timer)
export const saveTimeEntry = command(saveTimeEntrySchema, async (data) => {
	const { locals } = getRequestEvent();
	const userId = locals.user!.id;

	const [entry] = await db.insert(timeEntry).values({
		userId,
		description: data.description,
		customerId: data.customerId || null,
		startTime: new Date(data.startTime),
		stopTime: new Date(data.stopTime),
	}).returning();

	// Refresh the time entries query
	await getTimeEntries().refresh();

	return entry;
});

// Schema for manually entering a time entry
const manualTimeEntrySchema = v.object({
	description: v.string(),
	customerId: v.nullable(v.string()),
	date: v.string(), // YYYY-MM-DD format
	startTime: v.string(), // HH:MM format
	endTime: v.string(), // HH:MM format
});

// Command to create a manual time entry
export const createManualTimeEntry = command(manualTimeEntrySchema, async (data) => {
	const { locals } = getRequestEvent();
	const userId = locals.user!.id;

	// Parse the date and times
	const [year, month, day] = data.date.split('-').map(Number);
	const [startHour, startMinute] = data.startTime.split(':').map(Number);
	const [endHour, endMinute] = data.endTime.split(':').map(Number);

	const startDateTime = new Date(year, month - 1, day, startHour, startMinute);
	const stopDateTime = new Date(year, month - 1, day, endHour, endMinute);

	// Handle case where end time is before start time (spans midnight)
	if (stopDateTime < startDateTime) {
		stopDateTime.setDate(stopDateTime.getDate() + 1);
	}

	const [entry] = await db.insert(timeEntry).values({
		userId,
		description: data.description,
		customerId: data.customerId || null,
		startTime: startDateTime,
		stopTime: stopDateTime,
	}).returning();

	// Refresh the time entries query
	await getTimeEntries().refresh();

	return entry;
});

