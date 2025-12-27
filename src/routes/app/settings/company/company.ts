import type { Doc } from "$convex/_generated/dataModel";

export type CompanyData = {
    name: string;
    phone: string;
    street: string;
    zip: string;
    city: string;
    state: string;
    country: string;
    representative: string;
    bankName: string;
    bankIban: string;
    bankBic: string;
    taxNumber: string;
    smallBusiness: boolean;
};

export const extractCompanyData = (c: Doc<'companies'>): CompanyData => ({
    name: c.name,
    phone: c.phone,
    street: c.street,
    zip: c.zip,
    city: c.city,
    state: c.state,
    country: c.country,
    representative: c.representative,
    bankName: c.bankName,
    bankIban: c.bankIban,
    bankBic: c.bankBic,
    taxNumber: c.taxNumber,
    smallBusiness: c.smallBusiness,
});