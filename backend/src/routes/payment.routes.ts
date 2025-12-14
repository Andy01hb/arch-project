import { Router } from 'express';
import express from 'express';
import { createPaymentIntent, handleStripeWebhook, getPaymentStatus } from '../controllers/payment.controller';

const router = Router();

// Webhook needs raw body
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    handleStripeWebhook
);

router.post('/create-payment-intent', createPaymentIntent);
router.get('/status/:paymentIntentId', getPaymentStatus);

export default router;
