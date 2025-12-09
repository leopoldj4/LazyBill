import { $typst } from '@myriaddreamin/typst.ts';

import typstCompilerWasm from '@myriaddreamin/typst-ts-web-compiler/pkg/typst_ts_web_compiler_bg.wasm?url';
import typstRendererWasm from '@myriaddreamin/typst-ts-renderer/pkg/typst_ts_renderer_bg.wasm?url';

import type { Customer, Company } from "$lib/server/db/schema";


$typst.setRendererInitOptions({
    getModule: () => typstRendererWasm,
});

$typst.setCompilerInitOptions({
    getModule: () => typstCompilerWasm,
});

export const render = async (document: string) => {
    return await $typst.svg({
        mainContent: document,
    });
};

type InvoiceTemplateData = {
  invoiceNumber: number;
  invoiceDate: string;
  customer: Customer | null;
  articles: { name: string; quantity: number; price: number }[];
};

export function invoiceTemplate(invoice: InvoiceTemplateData, company: Company) {

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
    ${invoice.articles.map(article => `(
        description: "${article.quantity} x ${article.name} (${article.price}€)",
        price: ${article.price * article.quantity},
      )`).join(",\n")
    }
  ),
  // Author
  (
    name: "${company.name}",
    street: "${company.street}",
    zip: "${company.zip}",
    city: "${company.city}",
    tax_nr: "${company.taxNumber}",
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
    name: "${company.representative || company.name}",
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