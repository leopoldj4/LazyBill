import { json } from '@sveltejs/kit';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';

const stripe = new Stripe(STRIPE_SECRET_KEY);

function getUserIdFromToken(token: string | undefined): string {
	if (!token) return '';
	try {
		const payload = token.split('.')[1];
		const decoded = JSON.parse(atob(payload));
		return decoded.sub || '';
	} catch {
		return '';
	}
}

export const POST: RequestHandler = async ({ request, locals }) => {
	try {
		const { priceId, successUrl, cancelUrl } = await request.json();
		const userId = getUserIdFromToken(locals.token);

		if (!userId) {
			return json({ error: 'Not authenticated' }, { status: 401 });
		}

		const session = await stripe.checkout.sessions.create({
			mode: 'subscription',
			payment_method_types: ['card'],
			line_items: [
				{
					price: priceId,
					quantity: 1,
				},
			],
			success_url: successUrl,
			cancel_url: cancelUrl,
			metadata: {
				userId,
			},
		});

		return json({ url: session.url });
	} catch (error) {
		console.error('Stripe checkout error:', error);
		return json({ error: 'Failed to create checkout session' }, { status: 500 });
	}
};
