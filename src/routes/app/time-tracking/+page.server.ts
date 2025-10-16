import { db } from "$lib/server/db";
import { customer, task, timeEntry } from "$lib/server/db/schema";
import { fail } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import z from "zod";

export async function load({ locals }) {
    const userId = locals.user!.id;

    const customers = await db.query.customer.findMany({
        where: eq(customer.userId, userId),
    });

    const tasks = await db.query.task.findMany({
        where: and(eq(task.done, false), eq(task.userId, userId)),
    });

    return {
        customers,
        tasks,
    }
}

const timeEntrySaveSchema = z.object({
    taskId: z.string(),
    startTime: z.date(),
    stopTime: z.date().optional(),
});

const timeEntryUpdateSchema = z.object({
    id: z.string(),
    taskId: z.string(),
    startTime: z.date(),
    stopTime: z.date().optional(),
});

export const actions = {
    save: async ({ locals, request }) => {
        const form = await superValidate(request, zod4(timeEntrySaveSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        const userId = locals.user!.id;

        try {
            await db.insert(timeEntry).values({
                userId,
                taskId: form.data.taskId,
                startTime: form.data.startTime,
                stopTime: form.data.stopTime,
            });
        } catch (e) {
            console.error(e);
            return fail(400);
        }

        return { form };
    },
    
    update: async ({ locals, request }) => {
        const form = await superValidate(request, zod4(timeEntryUpdateSchema));

        if (!form.valid) {
            return
        }

        const userId = locals.user!.id;

        try {
            db.update(timeEntry).set({
                taskId: form.data.taskId,
                startTime: form.data.startTime,
                stopTime: form.data.stopTime,
            }).where(
                and(
                    eq(timeEntry.userId, userId),
                    eq(timeEntry.id, form.data.id)
                )
            );
        } catch (e) {
            console.error(e);
            return fail(400);
        }

    }
}