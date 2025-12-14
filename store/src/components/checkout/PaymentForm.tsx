'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

export default function PaymentForm({ onSuccess }: { onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success`,
            },
            redirect: 'if_required'
        });

        if (error) {
            setMessage(error.message || 'An unexpected error occurred.');
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess();
        } else {
            setMessage('El pago no se pudo completar. Inténtalo de nuevo.');
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            {message && <div style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem' }}>{message}</div>}
            <button
                disabled={isLoading || !stripe || !elements}
                className="btn btn-primary"
                style={{ marginTop: '1.5rem', width: '100%' }}
            >
                {isLoading ? 'Procesando...' : 'Pagar Ahora'}
            </button>
        </form>
    );
}
