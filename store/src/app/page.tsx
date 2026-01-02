import { getProducts } from '@/lib/products';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight, Box, Layers, Zap } from 'lucide-react';

export const revalidate = 60;

export default async function Home() {
  try {
    const products = await getProducts();

    return (
      <main className="min-h-screen bg-black overflow-hidden selection:bg-accent-blue selection:text-white">

        {/* Animated Background Mesh */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-mesh-spin opacity-40" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-mesh-spin opacity-40" style={{ animationDirection: 'reverse' }} />
        </div>

        {/* Hero Section */}
        <section className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 container text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-sm mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-accent-blue"></span>
            v2.0 Now Available
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 animate-fade-up">
            Constructing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">
              The Future
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Premium AutoCAD dynamic blocks, construction details, and templates.
            Designed for speed. Built for professionals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <Link href="/catalogo">
              <Button size="lg" variant="primary" className="group">
                Explore Catalog
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="ghost">How it Works</Button>
            </Link>
          </div>
        </section>

        {/* Trusted By / Stats */}
        <section className="relative z-10 py-12 border-y border-white/5 bg-white/[0.02]">
          <div className="container">
            <p className="text-center text-zinc-500 text-sm mb-8 uppercase tracking-widest">Trusted by efficient architects using</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {['AutoCAD', 'Revit', 'SketchUp', 'Rhino'].map((brand) => (
                <div key={brand} className="text-xl font-bold text-white flex items-center gap-2">
                  <Box className="h-6 w-6" /> {brand}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Catalog Preview */}
        <section id="catalog" className="relative z-10 py-24 container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Latest Releases</h2>
              <p className="text-zinc-400">Professional tools for your next project.</p>
            </div>
            <Link href="/catalogo" className="hidden md:block">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-xl">
                <Layers className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-500">No products available at the moment.</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link href="/catalogo">
              <Button variant="outline" className="w-full">View All Products</Button>
            </Link>
          </div>
        </section>

        {/* Value Props */}
        <section className="relative z-10 py-24 border-t border-white/5 bg-zinc-950">
          <div className="container grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-colors group">
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-zinc-400 leading-relaxed">Save hours of drafting time with our pre-optimized, layer-standardized dynamic blocks.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 transition-colors group">
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <Box className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Standard Compliant</h3>
              <p className="text-zinc-400 leading-relaxed">Built according to international ISO and ANSI plotting standards for perfect output.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-colors group">
              <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors">
                <Layers className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Fully Dynamic</h3>
              <p className="text-zinc-400 leading-relaxed">Smart parameters allow you to stretch, flip, and align blocks to fit any design context.</p>
            </div>
          </div>
        </section>

      </main>
    );
  } catch (error) {
    console.error('Error loading products:', error);
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-red-500 mb-2">System Malfunction</h2>
          <p className="text-zinc-500">Unable to load core modules. Please refresh.</p>
        </div>
      </main>
    );
  }
}
