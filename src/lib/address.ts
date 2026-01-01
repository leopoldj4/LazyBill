import type { Doc } from "$convex/_generated/dataModel";

export type Address = {
    street: string;
    zip: string;
    city: string;
    state: string;
    country: string;
};

export function isEmpty(address: Address) {
    return address.street.trim() === ''
        && address.zip.trim() === ''
        && address.city.trim() === ''
        && address.state.trim() === ''
        && address.country.trim() === '';
}

export function fromCompany(company: Doc<'companies'>) {
    return {
        street: company.street,
        zip: company.zip,
        city: company.city,
        state: company.state,
        country: company.country,
    };
}