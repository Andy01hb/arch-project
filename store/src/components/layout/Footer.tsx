import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-zinc-950 py-12 md:py-16 lg:py-20">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold tracking-tighter text-white">
                                ARCH<span className="text-blue-500">STORE</span>
                            </span>
                        </Link>
                        <p className="text-sm text-zinc-400 max-w-xs">
                            Premium AutoCAD components and architectural assets for modern professionals.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white">Product</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="/catalogo" className="hover:text-blue-400 transition-colors">Catalog</Link></li>
                            <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Changelog</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white">Resources</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Documentation</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Community</Link></li>
                            <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white">Newsletter</h3>
                        <p className="text-sm text-zinc-400">
                            Subscribe to get updates on new assets and features.
                        </p>
                        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 rounded-md bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                                title="Subscribe (Demo)"
                            >
                                Go
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/10 pt-8 text-center md:text-left">
                    <p className="text-xs text-zinc-500">
                        &copy; {new Date().getFullYear()} ArchStore. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
