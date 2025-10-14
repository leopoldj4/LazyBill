import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { fail } from "@sveltejs/kit";
import { z } from "zod/v4";
import { db } from "$lib/server/db/index.js";
import { company } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

const schema = z.object({
  name: z.string().min(1, "Company name is required"),
  phone: z.string().min(1, "Phone number is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  street: z.string().min(1, "Street address is required"),
  streetExtra: z.string().default(""),
  zip: z.string().min(1, "Zip code is required"),
  smallBusiness: z.boolean().default(false),
});

export const load = async ({ locals }) => {
  if (!locals.user) {
    throw new Error("User not authenticated");
  }

  // Fetch the user's company
  const companies = await db.select().from(company).where(eq(company.userId, locals.user.id)).limit(1);
  
  const existingCompany = companies[0];

  const form = await superValidate({
    name: existingCompany?.name || "",
    phone: existingCompany?.phone || "",
    country: existingCompany?.country || "",
    state: existingCompany?.state || "",
    city: existingCompany?.city || "",
    street: existingCompany?.street || "",
    streetExtra: existingCompany?.streetExtra || "",
    zip: existingCompany?.zip || "",
    smallBusiness: existingCompany?.smallBusiness || false,
  }, zod4(schema));

  return { 
    form,
    hasCompany: !!existingCompany,
  };
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
      const { name, phone, country, state, city, street, streetExtra, zip, smallBusiness } = form.data;

      // Check if company already exists
      const companies = await db.select().from(company).where(eq(company.userId, locals.user.id)).limit(1);
      
      if (companies.length > 0) {
        // Update existing company
        await db.update(company)
          .set({
            name,
            phone,
            country,
            state,
            city,
            street,
            streetExtra,
            zip,
            smallBusiness,
          })
          .where(eq(company.userId, locals.user.id));
      } else {
        // Create new company
        await db.insert(company).values({
          name,
          phone,
          country,
          state,
          city,
          street,
          streetExtra,
          zip,
          smallBusiness,
          userId: locals.user.id,
        });
      }

      return { form, success: true };
    } catch (error) {
      console.error("Error updating company:", error);
      return fail(500, { form });
    }
  }
};

