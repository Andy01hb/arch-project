'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/lib/products';
import { Button } from '@/components/ui/Button';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

export default function CatalogoPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'name' | 'price-asc' | 'price-desc'>('name');

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://arch-backend-90c5.onrender.com/api';
                const response = await fetch(`${apiUrl}/products`);

                if (!response.ok) {
                    throw new Error('Could not load catalog');
                }

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name': return a.name.localeCompare(b.name);
                case 'price-asc': return Number(a.price) - Number(b.price);
                case 'price-desc': return Number(b.price) - Number(a.price);
                default: return 0;
            }
        });

    return (
        <main className="min-h-screen bg-black text-zinc-200">

            {/* Header */}
            <div className="bg-zinc-950 border-b border-white/5 pt-24 pb-8">
                <div className="container">
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Catalog</h1>
                    <p className="text-zinc-500">Explore our professional component library.</p>
                </div>
            </div>

            <div className="container py-8">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                            <input
                                type="text"
                                placeholder="Search components..."
                                className="w-full bg-zinc-900 border border-white/10 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-zinc-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Categories</h3>
                            <div className="space-y-1">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group ${selectedCategory === cat
                                            ? 'bg-blue-500/10 text-blue-400'
                                            : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                                            }`}
                                    >
                                        <span className="capitalize">{cat === 'all' ? 'All Categories' : cat}</span>
                                        {selectedCategory === cat && <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort (Mobile/Desktop simple select) */}
                        <div>
                            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Sort By</h3>
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="w-full appearance-none bg-zinc-900 border border-white/10 text-zinc-300 text-sm rounded-md py-2 px-3 pr-8 focus:outline-none focus:border-blue-500/50"
                                >
                                    <option value="name">Name (A-Z)</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                            </div>
                        </div>

                    </aside>

                    {/* Main Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="aspect-[4/3] bg-zinc-900/50 animate-pulse rounded-xl border border-white/5" />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-20 rounded-xl border border-dashed border-red-500/20 bg-red-500/5">
                                <p className="text-red-400">{error}</p>
                                <Button variant="ghost" onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-20 rounded-xl border border-dashed border-white/10">
                                <SlidersHorizontal className="h-10 w-10 text-zinc-700 mx-auto mb-4" />
                                <h3 className="text-zinc-300 font-medium mb-1">No products found</h3>
                                <p className="text-zinc-500 text-sm">Try adjusting your search or filters.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
}
