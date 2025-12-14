import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';

const paymentService = new PaymentService();

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            res.status(400).json({ message: 'Order ID is required' });
            return;
        }

        const paymentIntent = await paymentService.createPaymentIntent(orderId);

        res.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({
            message: error instanceof Error ? error.message : 'Error creating payment intent'
        });
    }
};

export const handleStripeWebhook = async (req: Request, res: Response) => {
    try {
        const signature = req.headers['stripe-signature'] as string;

        if (!signature) {
            res.status(400).json({ message: 'Missing stripe signature' });
            return;
        }

        const result = await paymentService.handleWebhook(
            (req as any).rawBody || req.body,
            signature
        );

        res.json(result);
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Webhook error'
        });
    }
};

export const getPaymentStatus = async (req: Request, res: Response) => {
    try {
        const { paymentIntentId } = req.params;

        const paymentIntent = await paymentService.getPaymentIntent(paymentIntentId);

        res.json({
            status: paymentIntent.status,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
        });
    } catch (error) {
        console.error('Error fetching payment status:', error);
        res.status(500).json({ message: 'Error fetching payment status' });
    }
};
