'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Layers, Box, FileDigit, Ruler } from 'lucide-react';

interface ProductImageProps {
    src?: string;
    alt: string;
    fill?: boolean;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
}

export default function ProductImage({
    src,
    alt,
    fill = false,
    width,
    height,
    className,
    priority = false,
}: ProductImageProps) {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    // We can use different icons based on a simple hash of the alt text to generic variety
    const getPlaceholderIcon = () => {
        const icons = [Layers, Box, FileDigit, Ruler];
        const index = alt.length % icons.length;
        const Icon = icons[index];
        return <Icon className="w-1/3 h-1/3 text-blue-500/50" strokeWidth={1.5} />;
    };

    if (error || !src) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center bg-zinc-900 border border-zinc-800 overflow-hidden relative",
                    className,
                    !fill && "w-full h-full"
                )}
                style={!fill && width && height ? { width, height } : undefined}
            >
                {/* Blueprint grid pattern */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Diagonal lines for architectural feel */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

                {/* Placeholder Icon */}
                <div className="z-10 flex flex-col items-center gap-2 p-4 text-center">
                    {getPlaceholderIcon()}
                    <span className="text-xs text-zinc-500 font-mono tracking-wider uppercase">Asset Unavailable</span>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("relative overflow-hidden bg-zinc-900", className)}>
            <Image
                src={src}
                alt={alt}
                fill={fill}
                width={!fill ? width : undefined}
                height={!fill ? height : undefined}
                className={cn(
                    "transition-all duration-500 object-cover",
                    loading ? "scale-110 blur-lg opacity-0" : "scale-100 blur-0 opacity-100"
                )}
                onLoad={() => setLoading(false)}
                onError={() => setError(true)}
                priority={priority}
            />
        </div>
    );
}
