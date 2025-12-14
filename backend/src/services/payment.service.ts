import Stripe from 'stripe';
import { OrderService } from './order.service';

const orderService = new OrderService();

export class PaymentService {
    private getStripeInstance(): Stripe {
        const apiKey = process.env.STRIPE_SECRET_KEY;

        if (!apiKey || apiKey === 'sk_test_your_stripe_secret_key_here') {
            throw new Error('Stripe API key not configured. Please set STRIPE_SECRET_KEY in .env file');
        }

        return new Stripe(apiKey, {
            apiVersion: '2025-11-17.clover',
        });
    }

    async createPaymentIntent(orderId: string): Promise<Stripe.PaymentIntent> {
        const stripe = this.getStripeInstance();
        const order = await orderService.getOrderById(orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(order.total * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                orderId: order.id,
                customerEmail: order.customerEmail,
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        // Update order with payment intent ID
        await orderService.updateOrderStatus(
            orderId,
            'pending',
            paymentIntent.id
        );

        return paymentIntent;
    }

    async handleWebhook(
        payload: Buffer,
        signature: string
    ): Promise<{ received: boolean }> {
        const stripe = this.getStripeInstance();
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

        if (!webhookSecret || webhookSecret === 'whsec_your_webhook_secret_here') {
            throw new Error('Stripe webhook secret not configured');
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        } catch (err) {
            throw new Error(`Webhook signature verification failed: ${err}`);
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                const orderId = paymentIntent.metadata.orderId;

                if (orderId) {
                    await orderService.updateOrderStatus(orderId, 'completed');
                }
                break;

            case 'payment_intent.payment_failed':
                const failedPayment = event.data.object as Stripe.PaymentIntent;
                const failedOrderId = failedPayment.metadata.orderId;

                if (failedOrderId) {
                    await orderService.updateOrderStatus(failedOrderId, 'failed');
                }
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return { received: true };
    }

    async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
        const stripe = this.getStripeInstance();
        return stripe.paymentIntents.retrieve(paymentIntentId);
    }
}
