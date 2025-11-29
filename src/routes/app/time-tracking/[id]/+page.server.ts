import { db } from "$lib/server/db";
import { timeEntry } from "$lib/server/db/schema";
import { error, fail } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { z } from "zod/v4";

const updateDescriptionSchema = z.object({
    description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters")
});

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

    const form = await superValidate({ description: entry.description }, zod4(updateDescriptionSchema));

    return {
        entry,
        form
    };
}

export const actions = {
    updateDescription: async ({ locals, params, request }) => {
        const userId = locals.user!.id;
        const entryId = params.id;

        const form = await superValidate(request, zod4(updateDescriptionSchema));

        if (!form.valid) {
            return fail(400, { form });
        }

        try {
            await db.update(timeEntry)
                .set({
                    description: form.data.description
                })
                .where(
                    and(
                        eq(timeEntry.id, entryId),
                        eq(timeEntry.userId, userId)
                    )
                );
        } catch (e) {
            console.error(e);
            return fail(500, { form });
        }

        return { form };
    }
};
