import { redirect } from "@sveltejs/kit";

export const load = async ({ params }) => redirect(302, `/app/customers/${params.customerId}/invoices/${params.invoiceId}/edit`);