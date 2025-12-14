import { getProductById, getProducts } from '@/lib/products';
import Link from 'next/link';
import AddToCartButton from '@/components/ui/AddToCartButton';
import { notFound } from 'next/navigation';

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
        <div className="container" style={{ padding: '6rem 1rem' }}>
            <Link href="/" style={{ color: '#888', marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>&larr;</span> Volver al catálogo
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'start' }}>
                {/* Image Section */}
                <div style={{
                    background: '#1a1a1a',
                    aspectRatio: '4/3',
                    borderRadius: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #333'
                }}>
                    <span style={{ color: '#444', fontSize: '1.5rem' }}>Vista Previa: {product.name}</span>
                </div>

                {/* Info Section */}
                <div>
                    <span style={{
                        color: '#3b82f6',
                        fontWeight: '600',
                        marginBottom: '1rem',
                        display: 'inline-block',
                        background: 'rgba(59, 130, 246, 0.1)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.875rem'
                    }}>
                        {product.category}
                    </span>

                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', lineHeight: 1.2 }}>{product.name}</h1>

                    <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#fff' }}>
                        ${Number(product.price).toFixed(2)} <span style={{ fontSize: '1rem', color: '#666', fontWeight: 'normal' }}>USD</span>
                    </div>

                    <div style={{ marginBottom: '2.5rem', color: '#aaa', lineHeight: '1.7' }}>
                        <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Descripción</h3>
                        <p>{product.description}</p>
                    </div>

                    <div style={{ padding: '2rem', background: '#111', borderRadius: '1rem', border: '1px solid #333' }}>
                        <ul style={{ marginBottom: '1.5rem', color: '#888', fontSize: '0.9rem', listStyle: 'none' }}>
                            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: '#10b981' }}>✓</span> Descarga inmediata
                            </li>
                            <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: '#10b981' }}>✓</span> Formato .DWG compatible
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: '#10b981' }}>✓</span> Soporte técnico incluido
                            </li>
                        </ul>

                        <AddToCartButton product={product} />
                        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.8rem', color: '#555' }}>
                            Pago seguro procesado por PayPal
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
