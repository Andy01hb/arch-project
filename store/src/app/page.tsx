import { getProducts, Product } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';

// Revalidate every 60 seconds for fresh product data
export const revalidate = 60;

export default async function Home() {
  let products: Product[] = [];
  let error: string | null = null;

  try {
    products = await getProducts();
  } catch (e) {
    console.error('Failed to fetch products:', e);
    error = 'No se pudieron cargar los productos. Por favor, intenta más tarde.';
  }

  return (
    <main>
      {/* Hero Section */}
      <section style={{
        padding: '6rem 1rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at center, #1a1a1a 0%, #0a0a0a 100%)',
        borderBottom: '1px solid #222'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: '3.5rem',
            marginBottom: '1.5rem',
            background: 'linear-gradient(to right, #fff, #aaa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.1
          }}>
            Componentes de Autocad <br /> <span style={{ color: '#3b82f6', WebkitTextFillColor: '#3b82f6' }}>Profesionales</span>
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#888', maxWidth: '700px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            Ahorra horas de dibujo con nuestra biblioteca premium de bloques dinámicos, detalles constructivos y plantillas listas para usar.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href="#catalog" className="btn btn-primary">Explorar Catálogo</a>
            <a href="/about" className="btn" style={{ background: '#222', color: '#fff' }}>Cómo funciona</a>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="container" style={{ padding: '5rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '3rem' }}>
          <div>
            <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem' }}>Últimos Lanzamientos</h2>
            <p style={{ color: '#666' }}>Herramientas diseñadas para arquitectos e ingenieros.</p>
          </div>
          {/* Future: Filter controls here */}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {error ? (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '3rem',
              background: '#1a1a1a',
              borderRadius: '8px',
              border: '1px solid #333'
            }}>
              <p style={{ color: '#ef4444', fontSize: '1.1rem' }}>{error}</p>
            </div>
          ) : products.length > 0 ? (
            products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p style={{ color: '#666' }}>No hay productos disponibles por el momento.</p>
          )}
        </div>
      </section>
    </main>
  );
}
