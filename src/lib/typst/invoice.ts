import type { CalendarDate } from '@internationalized/date';
import type { Doc } from '$convex/_generated/dataModel';

type Article = {
    name: string;
    price: number;
};

function encode(x: any): string {
    return `json.decode("${JSON.stringify(x).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}")`;
}

export function invoiceTemplate(
    company: Doc<'companies'>,
    customer: Doc<'customers'>,
    articles: Article[],
    invoiceDate: CalendarDate,
    nr: string,
    due: number,
    notes: string,
) {

    const result = `
#import "@preview/invoice-pro:0.1.0": *

#let articles = ${encode(articles)}
#let company = ${encode(company)}
#let customer = ${encode(customer)}
#let nr = ${encode(nr)}
#let due = ${encode(due)}
#let date = datetime(..${encode({
        year: invoiceDate.year,
        month: invoiceDate.month,
        day: invoiceDate.day,
    })})
#let notes = ${encode(notes)}

#set text(lang: "de") 

#show: invoice.with(
    format: "DIN-5008-A",

    sender: (
        name: company.name,
        address: company.street,
        city: company.city,
        extra: (
            "Tel": [#company.phone],
        )
    ),

    recipient: (
        name: customer.name,
        address: customer.invoiceStreet,
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
    name: company.representative,
    bank: company.bankName,
    iban: company.bankIban,
    bic: company.bankBic,
)

#notes

#signature(signature: block[#company.representative])
`;

    return result;
}
