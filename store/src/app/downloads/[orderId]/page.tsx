import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Download, CheckCircle, Smartphone } from 'lucide-react';
import Link from 'next/link';

interface DownloadPageProps {
    params: Promise<{
        orderId: string;
    }>;
}

export default async function DownloadPage({ params }: DownloadPageProps) {
    const { orderId } = await params;

    return (
        <main className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">

                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-500/10 mb-6 ring-1 ring-green-500/30">
                        <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Order Confirmed!</h1>
                    <p className="text-zinc-500 font-mono">ID: {orderId}</p>
                </div>

                <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Download className="h-5 w-5 text-blue-500" />
                        Your Downloads
                    </h2>

                    <div className="space-y-4">
                        {/* Simulation of purchased items */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-zinc-950 rounded-xl border border-white/5 gap-4 hover:border-blue-500/30 transition-colors group">
                            <div className="flex-1">
                                <span className="block font-medium text-zinc-200 group-hover:text-blue-400 transition-colors">Complete Architectural Block Pack.zip</span>
                                <span className="text-xs text-zinc-500">25.4 MB • DWG Format</span>
                            </div>

                            <Button variant="primary" size="sm" className="w-full sm:w-auto">
                                Download File
                            </Button>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5 text-sm text-zinc-500 text-center">
                        <p>A confirmation email has been sent to your inbox.</p>
                        <p className="mt-2">Need help? <Link href="/contact" className="text-blue-400 hover:text-blue-300">Contact Support</Link></p>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <Link href="/catalogo">
                        <Button variant="ghost">Continue Shopping</Button>
                    </Link>
                </div>

            </div>

            {/* Client-side download handler simulation script */}
            <script dangerouslySetInnerHTML={{
                __html: `
                // Simple download handler simulation
                const buttons = document.querySelectorAll('button');
                buttons.forEach(btn => {
                    if(btn.innerText === 'Download File') {
                        btn.onclick = () => alert('Starting secure download...');
                    }
                });
              `}} />
        </main>
    );
}
