'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Navbar() {
    const { cartCount } = useCart();
    const pathname = usePathname();

    if (pathname.startsWith('/admin')) return null;

    return (
        <nav style={{
            borderBottom: '1px solid #222',
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            background: 'rgba(10, 10, 10, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 50
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '-0.05em' }}>
                    ARCH<span style={{ color: '#3b82f6' }}>STORE</span>
                </Link>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link href="/" style={{ color: pathname === '/' ? '#fff' : '#888', fontSize: '0.9rem' }}>
                        Catálogo
                    </Link>
                    <Link href="/about" style={{ color: pathname === '/about' ? '#fff' : '#888', fontSize: '0.9rem' }}>
                        Nosotros
                    </Link>
                    <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>🛒</span>
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: '#3b82f6',
                                color: 'white',
                                fontSize: '0.7rem',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="btn btn-primary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                                Login
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}
