'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
    const { items, removeFromCart, cartTotal, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Tu carrito está vacío</h1>
                <p style={{ color: '#888', marginBottom: '2rem' }}>Parece que aún no has añadido ningún componente.</p>
                <Link href="/" className="btn btn-primary">
                    Volver al Catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Carrito de Compras</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '3rem', alignItems: 'start' }}>
                {/* Cart Items */}
                <div>
                    {items.map((item) => (
                        <div key={item.id} style={{
                            display: 'flex',
                            gap: '1.5rem',
                            padding: '1.5rem',
                            background: '#111',
                            borderRadius: '0.75rem',
                            marginBottom: '1rem',
                            border: '1px solid #222',
                            alignItems: 'center'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: '#222',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem'
                            }}>
                                📦
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                                <p style={{ color: '#888', fontSize: '0.9rem' }}>{item.category}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                                    ${Number(item.price).toFixed(2)}
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={clearCart}
                        style={{
                            marginTop: '1rem',
                            background: 'transparent',
                            border: '1px solid #333',
                            color: '#888',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        Vaciar Carrito
                    </button>
                </div>

                {/* Summary */}
                <div style={{
                    background: '#1a1a1a',
                    padding: '2rem',
                    borderRadius: '1rem',
                    border: '1px solid #333',
                    position: 'sticky',
                    top: '100px'
                }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Resumen</h2>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#aaa' }}>
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.25rem', fontWeight: 'bold', color: '#fff' }}>
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>

                    <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', textAlign: 'center' }}>
                        Proceder al Pago
                    </Link>

                    <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
                        Al continuar, aceptas nuestros términos y condiciones.
                    </p>
                </div>
            </div>
        </div>
    );
}
