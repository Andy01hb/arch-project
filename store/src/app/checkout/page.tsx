'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '@/components/checkout/PaymentForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default function CheckoutPage() {
    const { items, cartTotal, clearCart } = useCart();
    const [clientSecret, setClientSecret] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isOrderCreated, setIsOrderCreated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleProceedToPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

            // 1. Create Order
            const orderRes = await fetch(`${apiUrl}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerEmail: email,
                    customerName: name,
                    items: items.map(item => ({
                        productId: item.id,
                        productName: item.name,
                        price: item.price,
                        quantity: item.quantity
                    }))
                })
            });

            if (!orderRes.ok) throw new Error('Failed to create order');
            const order = await orderRes.json();

            // 2. Create Payment Intent
            const paymentRes = await fetch(`${apiUrl}/payment/create-payment-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: order.id })
            });

            if (!paymentRes.ok) throw new Error('Failed to create payment intent');
            const paymentData = await paymentRes.json();

            setClientSecret(paymentData.clientSecret);
            setIsOrderCreated(true);

        } catch (error) {
            console.error('Checkout initialization failed:', error);
            alert('Error al iniciar el pago. Por favor intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccess = () => {
        clearCart();
        router.push('/checkout/success');
    };

    if (items.length === 0) {
        return (
            <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No hay nada que pagar</h1>
                <Link href="/" className="btn btn-primary">
                    Volver al Catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Finalizar Compra</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '4rem' }}>
                {/* Order Details */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Detalles del Pedido</h2>
                    <div style={{ background: '#111', borderRadius: '0.75rem', border: '1px solid #222', overflow: 'hidden' }}>
                        {items.map((item) => (
                            <div key={item.id} style={{
                                padding: '1rem',
                                borderBottom: '1px solid #222',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: '#888' }}>Cant: {item.quantity}</div>
                                </div>
                                <div>${(Number(item.price) * item.quantity).toFixed(2)}</div>
                            </div>
                        ))}
                        <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', background: '#1a1a1a' }}>
                            <span>Total a Pagar</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Section */}
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Datos y Pago</h2>
                    <div style={{ background: '#111', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #222' }}>

                        {!isOrderCreated ? (
                            <form onSubmit={handleProceedToPayment}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#ccc' }}>Nombre Completo</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: '#222',
                                            border: '1px solid #333',
                                            borderRadius: '0.5rem',
                                            color: '#fff',
                                            outline: 'none'
                                        }}
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#ccc' }}>Correo Electrónico</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            background: '#222',
                                            border: '1px solid #333',
                                            borderRadius: '0.5rem',
                                            color: '#fff',
                                            outline: 'none'
                                        }}
                                        placeholder="juan@ejemplo.com"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="btn btn-primary"
                                    style={{ width: '100%' }}
                                >
                                    {isLoading ? 'Iniciando...' : 'Continuar al Pago'}
                                </button>
                            </form>
                        ) : (
                            clientSecret && (
                                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night', labels: 'floating' } }}>
                                    <PaymentForm onSuccess={handleSuccess} />
                                </Elements>
                            )
                        )}

                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
                        Tus archivos estarán disponibles para descarga inmediatamente después del pago.
                    </p>
                </div>
            </div>
        </div>
    );
}
