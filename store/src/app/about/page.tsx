export default function AboutPage() {
    return (
        <main className="container py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8">Sobre Nosotros</h1>

                <div className="prose prose-invert max-w-none">
                    <p className="text-xl text-gray-300 mb-8">
                        En ArchStore nos dedicamos a optimizar el flujo de trabajo de arquitectos e ingenieros
                        proporcionando recursos de alta calidad listos para usar.
                    </p>

                    <div className="grid md:grid-cols-2 gap-12 my-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">Nuestra Misión</h2>
                            <p className="text-gray-400">
                                Eliminar el trabajo repetitivo en el diseño arquitectónico y estructural,
                                permitiendo a los profesionales enfocarse en lo que realmente importa: crear y diseñar.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-blue-400">Calidad Garantizada</h2>
                            <p className="text-gray-400">
                                Todos nuestros bloques y detalles son revisados por profesionales certificados
                                para asegurar el cumplimiento de estándares internacionales de dibujo técnico.
                            </p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-6">¿Por qué elegir nuestros recursos?</h2>
                    <ul className="space-y-4 text-gray-400">
                        <li className="flex items-start">
                            <span className="mr-2 text-green-400">✓</span>
                            <span><strong>Ahorro de Tiempo:</strong> Reduce horas de dibujo a minutos de implementación.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-green-400">✓</span>
                            <span><strong>Estandarización:</strong> Mantén un estilo gráfico coherente y profesional en todos tus planos.</span>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-green-400">✓</span>
                            <span><strong>Parametrización:</strong> Bloques dinámicos que se adaptan a tus necesidades específicas.</span>
                        </li>
                    </ul>

                    <div className="mt-12 p-6 bg-zinc-900 rounded-lg border border-zinc-800 text-center">
                        <h3 className="text-xl font-bold mb-2">¿Necesitas algo específico?</h3>
                        <p className="text-gray-400 mb-4">
                            Si no encuentras el detalle o bloque que buscas, contáctanos y lo desarrollaremos.
                        </p>
                        <a href="mailto:soporte@archstore.com" className="text-blue-400 hover:text-blue-300">
                            soporte@archstore.com
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
