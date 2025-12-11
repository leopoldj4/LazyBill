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

// Schema for starting a time entry (creates entry immediately)
const startTimeEntrySchema = v.object({
	description: v.string(),
	customerId: v.nullable(v.string()),
	startTime: v.iso.datetime(),
});

// Command to start a time entry (creates entry with just start time)
export const startTimeEntry = command(startTimeEntrySchema, async (data) => {
	const { locals } = getRequestEvent();
	const userId = locals.user!.id;

	const [entry] = await db.insert(timeEntry).values({
		userId,
		description: data.description,
		customerId: data.customerId || null,
		startTime: new Date(data.startTime),
		stopTime: null,
	}).returning();

	// Refresh the time entries query
	await getTimeEntries().refresh();

	return entry;
});

// Schema for updating a time entry (when stopping the timer)
const updateTimeEntrySchema = v.object({
	id: v.string(),
	description: v.string(),
	customerId: v.nullable(v.string()),
	stopTime: v.iso.datetime(),
});

// Command to update a time entry (when stopping the timer)
export const updateTimeEntry = command(updateTimeEntrySchema, async (data) => {
	const { locals } = getRequestEvent();
	const userId = locals.user!.id;

	const [entry] = await db.update(timeEntry)
		.set({
			description: data.description,
			customerId: data.customerId || null,
			stopTime: new Date(data.stopTime),
		})
		.where(eq(timeEntry.id, data.id))
		.returning();

	// Refresh the time entries query
	await getTimeEntries().refresh();

	return entry;
});

// Schema for deleting a time entry
const deleteTimeEntrySchema = v.object({
	id: v.string(),
});

// Command to delete a time entry (when aborting tracking)
export const deleteTimeEntry = command(deleteTimeEntrySchema, async (data) => {
	const { locals } = getRequestEvent();
	const userId = locals.user!.id;

	await db.delete(timeEntry)
		.where(eq(timeEntry.id, data.id));

	// Refresh the time entries query
	await getTimeEntries().refresh();
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


