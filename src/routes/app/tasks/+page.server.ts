import { db } from "$lib/server/db"
import { customer, task } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";

export async function load({ locals }) {
    const userId = locals.user!.id;

    const customers = await db.query.customer.findMany({
        where: eq(customer.userId, userId),
    });

    const tasks = await db.query.task.findMany({
        where: eq(task.userId, userId),
    });

    return {
        customers,
        tasks,
    }
}

export const actions = {
    createTask: async ({ request, locals }) => {
        const userId = locals.user.id;
        const formData = await request.formData();
        const taskName = formData.get('taskName') as string;
        const customerId = formData.get('customerId') as string | null;

        await db.insert(task).values({
            name: taskName,
            customerId: customerId,
            userId: userId,
        });
    },

    updateTask: async ({ request, locals }) => {
        const userId = locals.user.id;
        const formData = await request.formData();
        const taskId = formData.get('taskId')! as string;

        function optional(value: FormDataEntryValue | null): string | undefined {
            if (value === null) return undefined;
            return value as string;
        }

        function optionalBoolean(value: FormDataEntryValue | null): boolean | undefined {
            if (value === null) return undefined;
            return value == 'true';
        }

        const taskName = optional(formData.get('name'));
        const customerId = optional(formData.get('customerId'));
        const done = optionalBoolean(formData.get('done'));

        await db.update(task).set({
            name: taskName,
            customerId,
            done,
        }).where(and(eq(task.id, taskId), eq(task.userId, userId)));
    },
}
