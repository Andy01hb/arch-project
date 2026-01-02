'use client';

import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/products';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Check, ShoppingCart } from 'lucide-react';

export default function AddToCartButton({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = () => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <Button
            onClick={handleAdd}
            variant={isAdded ? "outline" : "primary"}
            size="lg"
            className={`w-full text-base py-6 ${isAdded ? 'border-green-500 text-green-500 hover:text-green-400 hover:border-green-400' : ''}`}
        >
            {isAdded ? (
                <>
                    <Check className="mr-2 h-5 w-5" />
                    Added to Cart!
                </>
            ) : (
                <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                </>
            )}
        </Button>
    );
}
