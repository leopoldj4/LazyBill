import { db } from "$lib/server/db";
import { timeEntry } from "$lib/server/db/schema";
import { error } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";

export async function load({ locals, params }) {
    const userId = locals.user!.id;
    const entryId = params.id;

    const entry = await db.query.timeEntry.findFirst({
        where: and(
            eq(timeEntry.id, entryId),
            eq(timeEntry.userId, userId)
        ),
        with: {
            customer: true
        }
    });

    if (!entry) {
        error(404, 'Time entry not found');
    }

    return {
        entry
    };
}

