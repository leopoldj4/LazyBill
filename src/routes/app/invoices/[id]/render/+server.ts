import { db } from "$lib/server/db";
import type { RequestHandler } from "@sveltejs/kit";
import { and, eq } from "drizzle-orm";
import { error } from "@sveltejs/kit";
import { invoice, customer, company } from "$lib/server/db/schema";
import { compile } from "$lib/typst-server";
import { TYPST_SERVER_URL } from "$env/static/private";

export const GET: RequestHandler = async ({ locals, params }) => {
  const userId = locals.user!.id;
  const invoiceId = params.id!;

  const invoiceData = await db.query.invoice.findFirst({
    where: and(eq(invoice.userId, userId), eq(invoice.id, invoiceId)),
    with: {
      customer: true,
    },
  });

  const companyData = await db.query.company.findFirst({
    where: eq(company.userId, userId),
  });

  if (!invoiceData) {
    return error(404, "Invoice not found");
  }

  if (!companyData) {
    return error(404, "Company not set up");
  }

  const template = invoiceTemplate(invoiceData, companyData);

  const document = await compile(template, TYPST_SERVER_URL);

  return new Response(document, {
    headers: {
      "Content-Type": "application/pdf",
    },
  });
}

type Invoice = typeof invoice.$inferSelect;
type Customer = typeof customer.$inferSelect;
type Company = typeof company.$inferSelect;

type InvoiceWithCustomer = Invoice & {
  customer: Customer | null;
  customerId: string | null;
};

function invoiceTemplate(invoice: InvoiceWithCustomer, company: Company) {

  const invoiceDate = new Date(invoice.invoiceDate);
  return `
    #import "@preview/classy-german-invoice:0.3.1": invoice

#show: invoice(
  // Invoice number
  "${invoice.invoiceNumber}",
  // Invoice date
  datetime(year: ${invoiceDate.getFullYear()}, month: ${invoiceDate.getMonth() + 1}, day: ${invoiceDate.getDate()}),
  // Items
  (
    (
      description: "The first service provided. The first service provided. The first service provided",
      price: 200,
    ),
    (
      description: "The second service provided",
      price: 150.2
    ),
  ),
  // Author
  (
    name: "${company.name}",
    street: "${company.street}",
    zip: "${company.zip}",
    city: "${company.city}",
    tax_nr: "TODO",
  ),
  // Recipient
  (
    name: "${invoice.customer?.name}",
    street: "${invoice.customer?.invoiceStreet}",
    zip: "${invoice.customer?.invoiceZip}",
    city: "${invoice.customer?.invoiceCity}",
  ),
  // Bank account
  (
    name: "${company.name}",
    bank: "${company.bankName}",
    iban: "${company.bankIban}",
    bic: "${company.bankBic}",
  ),
  // Umsatzsteuersatz (VAT)
  vat: 0.19,
  kleinunternehmer: ${company.smallBusiness ? "true" : "false"},
)
    `;
}