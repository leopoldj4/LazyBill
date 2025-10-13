import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { fail } from "@sveltejs/kit";
import { z } from "zod/v4";
import { db } from "$lib/server/db/index.js";
import { user } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "$lib/server/auth";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "Password must be at least 8 characters").optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: "Current password is required when changing password",
  path: ["currentPassword"],
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const load = async ({ locals }) => {
  if (!locals.user) {
    throw new Error("User not authenticated");
  }

  const form = await superValidate({
    name: locals.user.name,
    email: locals.user.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  }, zod4(schema));

  return { form };
};

export const actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      throw new Error("User not authenticated");
    }

    const form = await superValidate(request, zod4(schema));

    if (!form.valid) {
      return fail(400, { form });
    }

    try {
      const { name, email, currentPassword, newPassword } = form.data;

      // Check if email is being changed
      if (email !== locals.user.email) {
        // Check if email already exists
        const existingUser = await db.select().from(user).where(eq(user.email, email)).limit(1);
        if (existingUser.length > 0) {
          form.errors.email = ["Email already exists"];
          return fail(400, { form });
        }
      }

      // Update user in database
      await db.update(user)
        .set({
          name,
          email,
          updatedAt: new Date(),
        })
        .where(eq(user.id, locals.user.id));

      // If password is being changed, use better-auth's built-in method
      if (newPassword && currentPassword) {
        try {
          await auth.api.changePassword({
            body: {
              newPassword,
              currentPassword,
            },
            headers: request.headers,
          });
        } catch (error) {
          form.errors.newPassword = ["Failed to update password"];
          return fail(400, { form });
        }
      }

      return { form, success: true };
    } catch (error) {
      console.error("Error updating account:", error);
      return fail(500, { form });
    }
  }
};
