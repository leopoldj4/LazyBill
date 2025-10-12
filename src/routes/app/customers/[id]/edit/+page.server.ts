import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { fail, redirect, error } from "@sveltejs/kit";
import { z } from "zod/v4";
import { db } from "$lib/server/db/index.js";
import { customer } from "$lib/server/db/schema";
import { eq, and } from "drizzle-orm";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional(),
  customerNumber: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  notes: z.string().optional(),
});

export const load = async ({ params, locals }) => {
  const userId = locals.user!.id;
  const customerId = params.id;

  // Load customer data
  const customerData = await db.query.customer.findFirst({
    where: and(
      eq(customer.id, customerId),
      eq(customer.userId, userId)
    )
  });

  if (!customerData) {
    throw error(404, 'Customer not found');
  }

  // Pre-populate form with existing customer data
  const form = await superValidate(customerData, zod4(schema));

  return { 
    form,
    customer: customerData
  };
};

export const actions = {
  default: async ({ request, params, locals }) => {
    const userId = locals.user!.id;
    const customerId = params.id;

    const form = await superValidate(request, zod4(schema));

    if (!form.valid) {
      return fail(400, { form });
    }

    // Update customer in database
    const [updatedCustomer] = await db
      .update(customer)
      .set({
        ...form.data
      })
      .where(
        and(
          eq(customer.id, customerId),
          eq(customer.userId, userId)
        )
      )
      .returning();

    if (!updatedCustomer) {
      throw error(404, 'Customer not found');
    }

    return redirect(302, `/app/customers/${customerId}`);
  }
};
