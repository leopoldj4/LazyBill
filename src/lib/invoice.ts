import type { CalendarDate } from "@internationalized/date";
import type { Company, Customer } from "./server/db/schema";

type Article = {
    name: string;
    price: number;
};

function encode(x: any): string {
    return `json.decode("${JSON.stringify(x)
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        }")`
}

export function invoice(company: Company, customer: Customer, articles: Article[], invoiceDate: CalendarDate, nr: number, due: number) {
    return `
#import "@preview/invoice-pro:0.1.0": *

#let articles = ${encode(articles)}
#let company = ${encode(company)}
#let customer = ${encode(customer)}
#let nr = ${encode(nr)}
#let due = ${encode(due)}
#let date = datetime(..${encode({
        "year": invoiceDate.year,
        "month": invoiceDate.month,
        "day": invoiceDate.day,
    })})

#set text(lang: "de") 

#show: invoice.with(
    format: "DIN-5008-A",

    sender: (
        name: company.name,
        address: company.street + company.streetExtra,
        city: company.city,
        extra: (
            "Tel": [#company.phone],
        )
    ),

    recipient: (
        name: customer.name,
        address: customer.invoiceStreet + customer.invoiceStreetExtra,
        city: customer.invoiceZip + " " + customer.invoiceCity
    ),

    invoice-nr: nr,
    date: date,
    tax-nr: company.taxNumber,
    vat-exempt-small-biz: company.smallBusiness,
)

#invoice-line-items(
    ..articles.map(it => item([#it.name], price: it.price))
)

#payment-goal(days: due)

#bank-details(
    bank: company.bankName,
    iban: company.bankIban,
    bic: company.bankBic,
)

#signature(signature: block[#company.representative])
`;
}