import { redirect } from 'next/navigation';

interface DownloadPageProps {
    params: Promise<{
        orderId: string;
    }>;
}

// In a real app, you would fetch order details from API
// For now, we'll confirm the order ID exists and show a "Simulated" download page
export default async function DownloadPage({ params }: DownloadPageProps) {
    const { orderId } = await params;

    return (
        <main className="container py-12">
            <div className="max-w-2xl mx-auto text-center">
                <div className="mb-8">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold mb-2">¡Gracias por tu compra!</h1>
                    <p className="text-gray-400">Orden #{orderId}</p>
                </div>

                <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-8">
                    <h2 className="text-xl font-bold mb-6">Tus Archivos</h2>

                    <div className="space-y-4">
                        {/* Simulation of purchased items */}
                        <div className="flex items-center justify-between p-4 bg-zinc-800 rounded border border-zinc-700">
                            <div className="text-left">
                                <span className="block font-medium">Pack de Bloques Completos.zip</span>
                                <span className="text-xs text-gray-500">25.4 MB</span>
                            </div>
                            <a
                                href="#"
                                className="btn btn-primary text-sm py-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    allowedDownload();
                                }}
                            >
                                Descargar
                            </a>
                        </div>
                    </div>

                    <div className="mt-8 text-sm text-gray-500">
                        <p>Se ha enviado un correo de confirmación a tu dirección de email.</p>
                        <p className="mt-2">¿Problemas con la descarga? <a href="/contact" className="text-blue-400">Contáctanos</a></p>
                    </div>
                </div>
            </div>

            <script dangerouslySetInnerHTML={{
                __html: `
        function allowedDownload() {
            alert('En una implementación real, esto iniciaría la descarga del archivo seguro.');
        }
      `}} />
        </main>
    );
}
