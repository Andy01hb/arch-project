'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/products';
import { useState } from 'react';

export default function AddToCartButton({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = () => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAdd}
            className="btn btn-primary"
            style={{
                width: '100%',
                fontSize: '1.1rem',
                padding: '1rem',
                backgroundColor: isAdded ? '#10b981' : undefined,
                transition: 'background-color 0.3s ease'
            }}
        >
            {isAdded ? '¡Añadido al Carrito!' : 'Añadir al Carrito'}
        </button>
    );
}
