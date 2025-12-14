'use client';

import { useState, useEffect } from 'react';
import { Product, getProducts, createProduct, deleteProduct } from '@/lib/api';
import { UploadButton } from '@/lib/uploadthing';

export default function AdminPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        image: '',
        fileUrl: ''
    });

    // Prevent hydration mismatch
    useEffect(() => {
        setIsMounted(true);
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await getProducts();
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                console.error('API returned non-array data:', data);
                setProducts([]);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const newProduct = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                category: formData.category,
                image: formData.image || '/images/default.jpg',
                fileUrl: formData.fileUrl
            };

            await createProduct(newProduct);

            // Reload products and reset form
            await loadProducts();
            setShowForm(false);
            setFormData({ name: '', description: '', price: '', category: '', image: '', fileUrl: '' });
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Error al crear el producto');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await deleteProduct(id);
                await loadProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error al eliminar el producto');
            }
        }
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Panel de Administración</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary"
                >
                    {showForm ? 'Cancelar' : '+ Nuevo Producto'}
                </button>
            </div>

            {/* Add Product Form */}
            {showForm && (
                <div style={{
                    background: '#111',
                    padding: '2rem',
                    borderRadius: '1rem',
                    border: '1px solid #333',
                    marginBottom: '3rem'
                }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Agregar Producto</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: '#1a1a1a',
                                        border: '1px solid #333',
                                        borderRadius: '0.5rem',
                                        color: '#fff'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Categoría</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: '#1a1a1a',
                                        border: '1px solid #333',
                                        borderRadius: '0.5rem',
                                        color: '#fff'
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Descripción</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: '#1a1a1a',
                                    border: '1px solid #333',
                                    borderRadius: '0.5rem',
                                    color: '#fff',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Precio (USD)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: '#1a1a1a',
                                        border: '1px solid #333',
                                        borderRadius: '0.5rem',
                                        color: '#fff'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Imagen</label>
                                <div style={{ border: '1px solid #333', borderRadius: '0.5rem', padding: '0.5rem', background: '#1a1a1a' }}>
                                    <UploadButton
                                        endpoint="imageUploader"
                                        onClientUploadComplete={(res) => {
                                            if (res && res[0]) {
                                                setFormData({ ...formData, image: res[0].url });
                                                alert("Imagen subida correctamente");
                                            }
                                        }}
                                        onUploadError={(error: Error) => {
                                            alert(`ERROR! ${error.message}`);
                                        }}
                                    />
                                    {formData.image && (
                                        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#10b981' }}>
                                            Imagen seleccionada: {formData.image.split('/').pop()}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#aaa', fontSize: '0.9rem' }}>Archivo (.dwg)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.fileUrl}
                                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        background: '#1a1a1a',
                                        border: '1px solid #333',
                                        borderRadius: '0.5rem',
                                        color: '#fff'
                                    }}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Guardar Producto
                        </button>
                    </form>
                </div>
            )}

            {/* Products List */}
            <div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Productos ({products.length})</h2>

                {isLoading ? (
                    <p style={{ color: '#888' }}>Cargando...</p>
                ) : products.length === 0 ? (
                    <p style={{ color: '#888' }}>No hay productos. Agrega uno nuevo.</p>
                ) : (
                    <div style={{ background: '#111', borderRadius: '1rem', border: '1px solid #333', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#1a1a1a', borderBottom: '1px solid #333' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Producto</th>
                                    <th style={{ padding: '1rem', textAlign: 'left' }}>Categoría</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Precio</th>
                                    <th style={{ padding: '1rem', textAlign: 'center' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} style={{ borderBottom: '1px solid #222' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>{(product.description || '').substring(0, 60)}...</div>
                                        </td>
                                        <td style={{ padding: '1rem', color: '#aaa' }}>{product.category}</td>
                                        <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>${Number(product.price).toFixed(2)}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                style={{
                                                    background: 'transparent',
                                                    border: '1px solid #ef4444',
                                                    color: '#ef4444',
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '0.5rem',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
