'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
    const { items, removeFromCart, cartTotal, clearCart } = useCart();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
                <div className="h-20 w-20 bg-zinc-900 rounded-full flex items-center justify-center mb-6 border border-white/5">
                    <ShoppingBag className="h-8 w-8 text-zinc-600" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Cart Empty</h1>
                <p className="text-zinc-500 mb-8 max-w-sm">Looks like you haven't added any components to your project yet.</p>
                <Link href="/catalogo">
                    <Button variant="primary">Browse Catalog</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-32 pb-20">
            <div className="container px-4 md:px-6">
                <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    Your Cart <span className="text-sm font-normal text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-white/5">{items.length} items</span>
                </h1>

                <div className="grid lg:grid-cols-[1fr_350px] gap-12 items-start">
                    {/* Cart Items */}
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 bg-zinc-900/50 rounded-xl border border-white/5 items-center group hover:border-blue-500/20 transition-colors">
                                <div className="h-20 w-20 bg-zinc-800 rounded-lg flex items-center justify-center flex-shrink-0 border border-white/5">
                                    <ShoppingBag className="h-8 w-8 text-zinc-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{item.name}</h3>
                                    <p className="text-sm text-zinc-500">{item.category}</p>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-white mb-1">
                                        ${Number(item.price).toFixed(2)}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 justify-end transition-colors"
                                    >
                                        <Trash2 className="h-3 w-3" /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="text-right mt-6">
                            <Button variant="ghost" size="sm" onClick={clearCart} className="text-zinc-500 hover:text-red-500">
                                Clear Cart
                            </Button>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-zinc-900 border border-white/5 rounded-xl p-6 lg:sticky lg:top-32">
                        <h2 className="text-lg font-bold text-white mb-6">Order Summary</h2>

                        <div className="flex justify-between items-center mb-4 text-zinc-400">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center mb-8 pb-8 border-b border-white/5 text-xl font-bold text-white">
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>

                        <Link href="/checkout" className="block w-full">
                            <Button variant="primary" size="lg" className="w-full group">
                                Proceed to Checkout
                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>

                        <p className="mt-4 text-center text-xs text-zinc-600">
                            Secure checkout powered by Stripe
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
