import { Button } from '@/components/ui/Button';
import { Award, Users, Download, Globe, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: 'About Us | Arch Project',
    description: 'Constructing the future of architectural drafting.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-zinc-100 overflow-hidden">
            {/* Mission Hero */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="container relative z-10 text-center">
                    <h2 className="text-blue-500 font-mono text-sm mb-6 tracking-widest uppercase animate-fade-in">Our Mission</h2>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 max-w-4xl mx-auto leading-tight animate-fade-up">
                        We exist to eliminate the <br />
                        <span className="text-zinc-500">repetitive grind</span> of drafting.
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '0.1s' }}>
                        Arch Project provides architects and engineers with premium, standardized assets so they can focus on what actually matters: <span className="text-white font-medium">Design & Innovation</span>.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-20 border-y border-white/5 bg-white/[0.02]">
                <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { label: 'Active Users', value: '10k+', icon: Users },
                        { label: 'Assets', value: '500+', icon: Award },
                        { label: 'Downloads', value: '1M+', icon: Download },
                        { label: 'Countries', value: '45', icon: Globe },
                    ].map((stat, i) => (
                        <div key={stat.label} className="group hover:-translate-y-1 transition-transform duration-300">
                            <stat.icon className="w-6 h-6 mx-auto mb-4 text-zinc-600 group-hover:text-blue-500 transition-colors" />
                            <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                            <div className="text-sm text-zinc-500 uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Us */}
            <section className="py-24 container">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Built for the Modern Workflow</h2>
                        <p className="text-zinc-400 mb-8 leading-relaxed">
                            Traditional blocks are messy, layer-heavy, and break easily. Our assets are engineered with a "Zero-Error" philosophy.
                        </p>

                        <ul className="space-y-4">
                            {[
                                'ISO 13567 Layer Standards compliant',
                                'Fully parametric dynamic blocks',
                                'Lightweight geometry for faster plotting',
                                'BIM-ready metadata included'
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-zinc-300">
                                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-10">
                            <Link href="/catalogo">
                                <Button size="lg" variant="primary">Access the Library</Button>
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-2xl blur-2xl" />
                        <div className="relative rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur p-8">
                            {/* Abstract Blueprint Code Visual */}
                            <div className="font-mono text-sm space-y-2 text-zinc-500">
                                <div className="flex gap-4 border-b border-white/5 pb-4 mb-4">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                </div>
                                <p><span className="text-purple-400">class</span> <span className="text-yellow-200">DynamicBlock</span> {"{"}</p>
                                <p className="pl-4">public <span className="text-blue-400">geometry</span>: <span className="text-green-400">Polyline</span>;</p>
                                <p className="pl-4">public <span className="text-blue-400">parameters</span>: <span className="text-green-400">Constraints</span>[];</p>
                                <p className="pl-4">private <span className="text-blue-400">optimize</span>(): <span className="text-purple-400">void</span> {"{"}</p>
                                <p className="pl-8"><span className="text-zinc-600">// Reduces file size by 70%</span></p>
                                <p className="pl-8">this.purgeUnused();</p>
                                <p className="pl-4">{"}"}</p>
                                <p>{"}"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
