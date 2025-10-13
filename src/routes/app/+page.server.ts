import { db } from "$lib/server/db"
import { customer, invoice } from "$lib/server/db/schema";
import { eq, count } from "drizzle-orm";


export async function load({ locals }) {
    const userId = locals.user!.id;

    const [customersResult, invoicesResult] = await Promise.all([
        db.select({ count: count() })
            .from(customer)
            .where(eq(customer.userId, userId)),
        db.select({ count: count() })
            .from(invoice)
            .where(eq(invoice.userId, userId))
    ]);

    const customersCount = customersResult[0]?.count ?? 0;
    const invoicesCount = invoicesResult[0]?.count ?? 0;

    return { 
        customersCount,
        invoicesCount
    }
}

