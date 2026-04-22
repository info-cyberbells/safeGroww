import { Activity, ArrowRight, Bolt } from "lucide-react";


export default function Features() {
    return (
        <section className="py-32 px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Live Market Data */}
                <div className="md:col-span-8 bg-surface-container rounded-lg p-10 flex flex-col justify-between min-h-[500px] relative overflow-hidden group border border-surface-container-highest">
                    <div className="relative z-10">
                        <span className="text-primary text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block underline underline-offset-8">Engineered Performance</span>
                        <h3 className="text-4xl font-bold text-on-surface mb-6">Live Market Data</h3>
                        <p className="text-on-surface-variant max-w-md leading-relaxed font-light">
                            Direct fiber-optic connections to global liquidity providers. Experience 0.5ms median latency and sub-second order book updates across 150+ trading pairs.
                        </p>
                    </div>

                    {/* Mock Terminal */}
                    <div className="mt-12 relative z-10 overflow-hidden rounded border border-outline-variant/10 bg-surface-container-low shadow-2xl transition-transform group-hover:scale-[1.01] duration-500">
                        <div className="flex items-center gap-2 px-4 py-2 border-b border-outline-variant/10 bg-surface-container-high">
                            <div className="flex gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-error-dim/40" />
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/20" />
                            </div>
                            <span className="text-[9px] uppercase tracking-widest text-on-surface-variant font-mono">feed.obsidian.terminal</span>
                        </div>
                        <div className="p-6 font-mono text-[10px] space-y-2 tabular">
                            <div className="flex justify-between text-primary/80">
                                <span>[SUCCESS]</span>
                                <span>WEBSOCKET CONNECTED: QUOTE_STREAM_PRO</span>
                            </div>
                            <div className="flex justify-between opacity-90">
                                <span>TICK_ID: 92834</span>
                                <span className="text-on-surface">PRICE: 64292.12</span>
                                <span>SIZE: 1.25</span>
                            </div>
                            <div className="flex justify-between opacity-70">
                                <span>TICK_ID: 92835</span>
                                <span className="text-on-surface">PRICE: 64292.15</span>
                                <span>SIZE: 0.88</span>
                            </div>
                            <div className="flex justify-between opacity-40">
                                <span>TICK_ID: 92836</span>
                                <span>PRICE: 64292.14</span>
                                <span>SIZE: 2.11</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative background image */}
                    <div className="absolute right-0 bottom-0 w-full h-full opacity-10 pointer-events-none">
                        <img
                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            src="/images/market-data.webp"
                            alt="Market data"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                </div>

                {/* Automated Strategies */}
                <div className="md:col-span-4 bg-surface-container-high rounded-lg p-10 flex flex-col justify-between border-t border-primary/30 shadow-xl">
                    <div>
                        <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center mb-8">
                            <Bolt className="text-primary fill-primary/20" size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-on-surface mb-4">Automated Strategies</h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed font-light">
                            Deploy Python or TypeScript models directly into our execution environment. Zero-friction API integration for institutional workflows.
                        </p>
                    </div>
                    <div className="mt-8 pt-8 border-t border-outline-variant/10">
                        <a href="#" className="text-xs font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2 group">
                            Explore SDK
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </div>

                {/* Low Latency Stat Card */}
                <div className="md:col-span-4 bg-surface-container-high rounded-lg p-10 flex flex-col justify-between shadow-xl">
                    <div>
                        <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center mb-8">
                            <Activity className="text-primary" size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-on-surface mb-4">Low Latency</h3>
                        <p className="text-sm text-on-surface-variant leading-relaxed font-light">
                            Our architecture is built on Bare Metal infrastructure at Equinix NY4, ensuring you never miss a tick due to networking overhead.
                        </p>
                    </div>
                    <div className="flex items-center gap-8 mt-10">
                        <div>
                            <div className="text-2xl font-black text-on-surface tabular">0.05ms</div>
                            <div className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">Internal Hop</div>
                        </div>
                        <div className="w-[1px] h-8 bg-outline-variant/30" />
                        <div>
                            <div className="text-2xl font-black text-on-surface tabular">99.99%</div>
                            <div className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">Uptime</div>
                        </div>
                    </div>
                </div>

                {/* Large Desktop Promo */}
                <div className="md:col-span-8 bg-surface-container rounded-lg overflow-hidden flex flex-col md:flex-row border border-surface-container-highest">
                    <div className="p-10 flex flex-col justify-center flex-1">
                        <h3 className="text-3xl font-bold text-on-surface mb-4">Precision over clutter.</h3>
                        <p className="text-on-surface-variant text-sm font-light leading-relaxed mb-8">
                            The Obsidian interface removes the noise of traditional terminals, allowing traders to focus on strategy execution and risk management through high-fidelity visualisations.
                        </p>
                        <button className="w-fit px-8 py-3 border border-outline-variant/30 text-on-surface text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-surface-container-highest transition-colors rounded">
                            Request Demo
                        </button>
                    </div>
                    <div className="flex-1 bg-surface-container-low min-h-[300px] relative">
                        <img
                            className="w-full h-full object-cover opacity-80 hover:scale-105 transition-all duration-1000"
                             src="/images/system-data.webp"  
        alt="System Image"
                            referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-surface-container via-surface-container/10 to-transparent" />
                    </div>
                </div>
            </div>
        </section>
    )
};
