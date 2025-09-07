import { db } from "$lib/server/db";
import { customer, task } from "$lib/server/db/schema";
import { and, eq } from "drizzle-orm";

export async function load({ locals }) {
    const userId = locals.user.id;

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