import { db } from '$lib/server/db';
import type { RequestHandler } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { invoice, company } from '$lib/server/db/schema';
import { compile } from '$lib/typst-server';
import { TYPST_SERVER_URL } from '$env/static/private';
import { invoiceTemplate } from '$lib/render';

export const GET: RequestHandler = async ({ locals, params }) => {
	const userId = locals.user!.id;
	const invoiceId = params.id!;

	const invoiceData = await db.query.invoice.findFirst({
		where: and(eq(invoice.userId, userId), eq(invoice.id, invoiceId)),
		with: {
			customer: true,
			articles: true,
		},
	});

	const companyData = await db.query.company.findFirst({
		where: eq(company.userId, userId),
	});

	if (!invoiceData) {
		return error(404, 'Invoice not found');
	}

	if (!companyData) {
		return error(404, 'Company not set up');
	}

	const template = invoiceTemplate(invoiceData, companyData);

	const document = await compile(template, TYPST_SERVER_URL);

	return new Response(document, {
		headers: {
			'Content-Type': 'application/pdf',
		},
	});
};
