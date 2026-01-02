'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function Navbar() {
    const { cartCount } = useCart();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    if (pathname?.startsWith('/admin')) return null;

    const navLinks = [
        { href: '/catalogo', label: 'Catalog' },
        { href: '/about', label: 'About' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
            <div className="container flex h-16 items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-8 w-8 bg-blue-600/20 rounded-lg flex items-center justify-center border border-blue-500/30 group-hover:bg-blue-600/30 transition-colors">
                        <Box className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-xl font-bold tracking-tighter text-white">
                        ARCH<span className="text-blue-500">PROJECT</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex gap-6">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="relative py-2"
                                >
                                    <span className={cn(
                                        "text-sm font-medium transition-colors hover:text-white",
                                        isActive ? "text-white" : "text-zinc-400"
                                    )}>
                                        {link.label}
                                    </span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-indicator"
                                            className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="h-6 w-px bg-white/10" />

                    <div className="flex items-center gap-4">
                        <Link href="/cart" className="relative group p-2">
                            <ShoppingCart className={cn(
                                "h-5 w-5 transition-colors",
                                cartCount > 0 ? "text-blue-400" : "text-zinc-400 group-hover:text-white"
                            )} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-lg shadow-blue-900/50">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <SignedOut>
                            <SignInButton mode="modal">
                                <Button variant="glow" size="sm" className="h-9 px-4">
                                    Sign In
                                </Button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "h-9 w-9 ring-2 ring-white/10 hover:ring-white/20 transition-all"
                                    }
                                }}
                            />
                        </SignedIn>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <div className="flex items-center gap-4 md:hidden">
                    <Link href="/cart" className="relative p-2">
                        <ShoppingCart className={cn("h-5 w-5", cartCount > 0 ? "text-blue-400" : "text-zinc-400")} />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-zinc-400 hover:text-white">
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-b border-white/5 bg-zinc-950/95 overflow-hidden"
                    >
                        <div className="container py-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "block text-base font-medium py-2 border-b border-white/5",
                                        pathname === link.href ? "text-blue-400" : "text-zinc-400"
                                    )}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-4">
                                <SignedOut>
                                    <SignInButton mode="modal">
                                        <Button className="w-full" variant="secondary">Sign In</Button>
                                    </SignInButton>
                                </SignedOut>
                                <SignedIn>
                                    <div className="flex justify-center">
                                        <UserButton />
                                    </div>
                                </SignedIn>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
