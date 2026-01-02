'use client';

import Link from 'next/link';
import { Product } from '@/lib/products';
import ProductImage from '@/components/ui/ProductImage';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50 transition-all duration-300 hover:border-blue-500/50 hover:bg-zinc-900 hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="aspect-[4/3] w-full overflow-hidden border-b border-white/5 bg-zinc-950">
                <ProductImage
                    src={product.image}
                    alt={product.name}
                    fill
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold leading-tight text-white group-hover:text-blue-400 transition-colors">
                        {product.name}
                    </h3>
                    <span className="inline-flex shrink-0 items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-zinc-400">
                        {product.category || 'DWG'}
                    </span>
                </div>

                <p className="mb-6 flex-1 text-sm text-zinc-400 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-xl font-bold text-white tracking-tight">
                        ${Number(product.price).toFixed(2)}
                    </span>
                    <Link
                        href={`/products/${product.id}`}
                        className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-950 transition-all hover:bg-blue-500 hover:text-white hover:scale-105 active:scale-95"
                    >
                        Ver Detalle
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
