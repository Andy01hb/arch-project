import { getProducts } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';

export const revalidate = 60;

export default async function CatalogPage() {
    const products = await getProducts();

    // Extract unique categories
    const categories = Array.from(new Set(products.map(p => p.category)));

    return (
        <main className="container py-12">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4">Catálogo Completo</h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Explora nuestra colección completa de recursos para AutoCAD.
                    Filtra por categoría para encontrar exactamente lo que necesitas.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="sticky top-24 p-6 bg-zinc-900 rounded-lg border border-zinc-800">
                        <h3 className="font-bold mb-4 text-lg">Categorías</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="block py-2 px-3 rounded bg-blue-600 text-white text-sm">
                                    Todos
                                </a>
                            </li>
                            {categories.map(cat => (
                                <li key={cat}>
                                    <a href={`#${cat}`} className="block py-2 px-3 rounded hover:bg-zinc-800 text-gray-400 text-sm transition-colors">
                                        {cat}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-grow">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.length > 0 ? (
                            products.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                <p>No se encontraron productos disponibles.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
