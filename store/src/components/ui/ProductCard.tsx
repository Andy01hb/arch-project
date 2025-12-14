import Link from 'next/link';
import { Product } from '@/lib/products';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="card">
            <div style={{
                height: '200px',
                background: '#1a1a1a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: '1px solid #333'
            }}>
                {/* Placeholder for image - In real app use next/image */}
                <span style={{ color: '#444', fontWeight: 'bold' }}>Vista Previa</span>
            </div>
            <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', lineHeight: '1.4' }}>{product.name}</h3>
                    <span style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.5rem',
                        background: '#333',
                        borderRadius: '4px',
                        color: '#aaa'
                    }}>{product.category}</span>
                </div>
                <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {product.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>${Number(product.price).toFixed(2)}</span>
                    <Link href={`/products/${product.id}`} className="btn btn-primary" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
                        Ver Detalle
                    </Link>
                </div>
            </div>
        </div>
    );
}
