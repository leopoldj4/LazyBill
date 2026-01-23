import { json } from '@sveltejs/kit';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';

const stripe = new Stripe(STRIPE_SECRET_KEY);
const webhookSecret = STRIPE_WEBHOOK_SECRET;

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	if (!signature) {
		return json({ error: 'No signature' }, { status: 400 });
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
	} catch (err) {
		console.error('Webhook signature verification failed:', err);
		return json({ error: 'Invalid signature' }, { status: 400 });
	}

	switch (event.type) {
		case 'checkout.session.completed': {
			const session = event.data.object as Stripe.Checkout.Session;
			console.log('Checkout completed:', session.id);
			break;
		}
		case 'customer.subscription.created':
		case 'customer.subscription.updated': {
			const subscription = event.data.object as Stripe.Subscription;
			console.log('Subscription updated:', subscription.id, subscription.status);
			break;
		}
		case 'customer.subscription.deleted': {
			const subscription = event.data.object as Stripe.Subscription;
			console.log('Subscription deleted:', subscription.id);
			break;
		}
	}

	return json({ received: true });
};
