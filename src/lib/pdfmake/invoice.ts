import type { CalendarDate } from '@internationalized/date';
import { getLocalTimeZone } from '@internationalized/date';
import type { Doc } from '$convex/_generated/dataModel';

type Article = {
	name: string;
	price: number;
};

type PdfDocDefinition = Record<string, unknown>;

const vatRate = 0.19;
const currencyFormatter = new Intl.NumberFormat('de-DE', {
	style: 'currency',
	currency: 'EUR',
});

function formatCurrency(value: number) {
	return currencyFormatter.format(Math.round(value * 100) / 100);
}

function formatInvoiceDate(date: CalendarDate) {
	return date.toDate(getLocalTimeZone()).toLocaleDateString('de-DE');
}

function asLines(values: Array<string | null | undefined>) {
	return values.filter((value) => value && value.trim()).map((value) => ({ text: value as string }));
}

export function invoicePdfDefinition(
	company: Doc<'companies'>,
	customer: Doc<'customers'>,
	articles: Article[],
	invoiceDate: CalendarDate,
	nr: string,
	due: number,
	notes: string,
): PdfDocDefinition {
	const safeDue = Number.isFinite(due) && due > 0 ? Math.floor(due) : 0;
	const dueDate = invoiceDate.add({ days: safeDue });
	const dueLabel = safeDue ? `${safeDue} Tage` : 'sofort';

	const hasVat = !company.smallBusiness;
	const grossTotal = articles.reduce((sum, article) => sum + (Number(article.price) || 0), 0);
	const netTotal = hasVat ? grossTotal / (1 + vatRate) : grossTotal;
	const vatAmount = hasVat ? grossTotal - netTotal : 0;

	const senderLines = asLines([
		company.name,
		company.street,
		`${company.zip} ${company.city}`.trim(),
		company.country,
		company.phone ? `Tel: ${company.phone}` : null,
	]);

	const recipientLines = asLines([
		customer.name,
		customer.street,
		`${customer.zip} ${customer.city}`.trim(),
		customer.country,
	]);

	const itemsBody: Array<Array<Record<string, unknown>>> = [
		[
			{ text: 'Pos', style: 'tableHeader' },
			{ text: 'Beschreibung', style: 'tableHeader' },
			{ text: 'Preis', style: 'tableHeader', alignment: 'right' },
		],
	];

	if (articles.length === 0) {
		itemsBody.push([
			{ text: 'Keine Positionen', colSpan: 3, italics: true, color: '#6b7280' },
			{},
			{},
		]);
	} else {
		itemsBody.push(
			...articles.map((article, index) => [
				{ text: `${index + 1}`, alignment: 'right' },
				{ text: article.name || '—' },
				{ text: formatCurrency(Number(article.price) || 0), alignment: 'right' },
			]),
		);
	}

	const totalsBody: Array<Array<Record<string, unknown>>> = [
		[
			{ text: 'Zwischensumme', alignment: 'right', color: '#374151' },
			{ text: formatCurrency(netTotal), alignment: 'right' },
		],
	];

	if (hasVat) {
		totalsBody.push([
			{ text: `MwSt. ${Math.round(vatRate * 100)}%`, alignment: 'right', color: '#374151' },
			{ text: formatCurrency(vatAmount), alignment: 'right' },
		]);
	}

	totalsBody.push([
		{ text: 'Gesamt', alignment: 'right', bold: true },
		{ text: formatCurrency(grossTotal), alignment: 'right', bold: true },
	]);

	const content: Array<Record<string, unknown>> = [
		{
			columns: [
				{ text: company.name || 'Rechnung', style: 'companyName' },
				{ text: `Rechnung ${nr}`, style: 'invoiceTitle', alignment: 'right' },
			],
			margin: [0, 0, 0, 18],
		},
		{
			columns: [
				{
					width: '*',
					stack: [{ text: 'Von', style: 'sectionLabel' }, ...senderLines],
				},
				{
					width: '*',
					stack: [{ text: 'An', style: 'sectionLabel' }, ...recipientLines],
				},
			],
			columnGap: 24,
			margin: [0, 0, 0, 18],
		},
		{
			columns: [
				{
					width: '*',
					stack: [
						{ text: 'Rechnungsnummer', style: 'metaLabel' },
						{ text: nr, style: 'metaValue' },
					],
				},
				{
					width: '*',
					stack: [
						{ text: 'Rechnungsdatum', style: 'metaLabel' },
						{ text: formatInvoiceDate(invoiceDate), style: 'metaValue' },
					],
				},
				{
					width: '*',
					stack: [
						{ text: 'Fällig am', style: 'metaLabel' },
						{ text: formatInvoiceDate(dueDate), style: 'metaValue' },
					],
				},
			],
			columnGap: 24,
			margin: [0, 0, 0, 14],
		},
		{
			text: `Zahlbar in ${dueLabel}`,
			color: '#6b7280',
			margin: [0, 0, 0, 16],
		},
		{
			table: {
				headerRows: 1,
				widths: [32, '*', 90],
				body: itemsBody,
			},
			layout: 'lightHorizontalLines',
			margin: [0, 0, 0, 12],
		},
		{
			columns: [
				{ width: '*', text: '' },
				{
					width: 180,
					table: {
						widths: ['*', 'auto'],
						body: totalsBody,
					},
					layout: 'noBorders',
				},
			],
			margin: [0, 0, 0, 16],
		},
	];

	if (company.smallBusiness) {
		content.push({
			text: 'Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.',
			italics: true,
			color: '#6b7280',
			margin: [0, 0, 0, 12],
		});
	}

	content.push({
		text: `Bitte überweisen Sie den Gesamtbetrag von ${formatCurrency(
			grossTotal,
		)} innerhalb von ${dueLabel} ohne Abzug auf das unten genannte Konto.`,
		margin: [0, 0, 0, 16],
	});

	if (notes && notes.trim()) {
		content.push(
			{ text: 'Anmerkungen', style: 'sectionLabel', margin: [0, 0, 0, 6] },
			{ text: notes.trim(), margin: [0, 0, 0, 16] },
		);
	}

	content.push(
		{ text: 'Bankverbindung', style: 'sectionLabel', margin: [0, 0, 0, 6] },
		{
			stack: asLines([
				company.representative ? `Kontoinhaber: ${company.representative}` : null,
				company.bankName ? `Bank: ${company.bankName}` : null,
				company.bankIban ? `IBAN: ${company.bankIban}` : null,
				company.bankBic ? `BIC: ${company.bankBic}` : null,
				company.taxNumber ? `Steuernummer: ${company.taxNumber}` : null,
			]),
		},
	);

	return {
		pageSize: 'A4',
		pageMargins: [40, 56, 40, 56],
		content,
		defaultStyle: {
			fontSize: 10,
		},
		styles: {
			companyName: {
				fontSize: 18,
				bold: true,
			},
			invoiceTitle: {
				fontSize: 18,
				bold: true,
			},
			sectionLabel: {
				fontSize: 11,
				bold: true,
				margin: [0, 0, 0, 4],
			},
			metaLabel: {
				fontSize: 9,
				color: '#6b7280',
				margin: [0, 0, 0, 2],
			},
			metaValue: {
				fontSize: 10,
				bold: true,
			},
			tableHeader: {
				bold: true,
				fillColor: '#f3f4f6',
				margin: [0, 4, 0, 4],
			},
		},
	};
}
