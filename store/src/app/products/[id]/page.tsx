import { getProductById, getProducts } from '@/lib/products';
import Link from 'next/link';
import AddToCartButton from '@/components/ui/AddToCartButton';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, Layers } from 'lucide-react';

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((product) => ({
        id: product.id.toString(),
    }));
}

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-black pt-32 pb-20">
            <div className="container px-4 md:px-6">
                <Link href="/catalogo" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors group">
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Catalog
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* Image Section */}
                    <div className="relative aspect-[4/3] bg-zinc-900 rounded-2xl border border-white/5 overflow-hidden shadow-2xl shadow-blue-900/10">
                        {/* Fallback / Preview Visual */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f111a]">
                            <div className="absolute inset-0 opacity-20"
                                style={{ backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }}
                            />
                            <div className="relative z-10 h-20 w-20 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-4 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                <Layers className="h-10 w-10 text-blue-400" />
                            </div>
                            <span className="relative z-10 text-xs font-mono text-blue-500/50 uppercase tracking-widest">Product Preview</span>
                            <p className="relative z-10 text-zinc-400 mt-2 font-medium">{product.name}</p>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-500/20">
                            {product.category}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-4xl font-bold text-white">${Number(product.price).toFixed(2)}</span>
                            <span className="text-zinc-500">USD</span>
                        </div>

                        <div className="prose prose-invert prose-blue max-w-none mb-10 text-zinc-400 leading-relaxed">
                            <h3 className="text-white text-lg font-semibold mb-2">Description</h3>
                            <p>{product.description}</p>
                        </div>

                        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-8 backdrop-blur-sm">
                            <ul className="space-y-3 mb-8 text-zinc-400 text-sm">
                                <li className="flex items-center gap-3">
                                    <Check className="h-4 w-4 text-emerald-500" />
                                    Instant Download
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-4 w-4 text-emerald-500" />
                                    Compatible with AutoCAD 2013+
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="h-4 w-4 text-emerald-500" />
                                    Premium Layer Standards
                                </li>
                            </ul>

                            <AddToCartButton product={product} />

                            <p className="mt-4 text-center text-xs text-zinc-600">
                                Secure payment processing via Stripe/PayPal
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
