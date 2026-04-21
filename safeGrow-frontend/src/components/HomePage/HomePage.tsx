"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    Bolt,
    Cpu,
    ShieldCheck,
    Activity,
    ExternalLink,
    ChevronRight,
    Menu,
    Terminal as TerminalIcon
} from "lucide-react";

import { useRouter } from "next/navigation";

// --- Components ---

const Navbar = () => {
    const router = useRouter();
    return (
        <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 bg-surface-container/80 backdrop-blur-md h-16 border-b border-surface-container-highest">
            <div className="max-w-7xl mx-auto flex justify-between items-center w-full">
                <div className="flex items-center gap-12">
                    <span className="text-lg font-black tracking-tighter text-on-surface uppercase">OBSIDIAN</span>
                    <div className="hidden md:flex items-center gap-6">
                        {['Markets', 'Terminal', 'Portfolio', 'Analytics'].map((item) => (
                            <a key={item} href="#" className="text-xs font-medium text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/login")}
                        className="px-5 py-2 text-primary hover:bg-primary hover:text-white transition-all duration-300 rounded text-[10px] font-bold uppercase tracking-widest border border-primary/20 hover:border-primary">
                        Execute Login
                    </button>
                    <button className="md:hidden text-on-surface">
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </nav>
    )
};

const Hero = () => {
    const router = useRouter();
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
            {/* Full Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1611974717482-482d86f784e5?auto=format&fit=crop&q=80&w=2000"
                    alt="Stock Market Trading"
                    className="w-full h-full object-cover opacity-60 brightness-110 blur-[1px]"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/40 to-white" />
            </div>

            {/* Background Glows */}
            <div className="absolute inset-0 pointer-events-none z-1">
                <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-primary-container/30 blur-[100px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mb-8 flex items-center gap-2 px-4 py-1.5 bg-white/40 backdrop-blur-md rounded-full border border-primary/20"
                >
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary-dim">System Status: Optimal</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-[-0.04em] leading-[0.85] text-on-surface mb-10 drop-shadow-sm"
                >
                    Automate Your <br />
                    <motion.span
                        initial={{ color: "var(--color-on-surface)" }}
                        animate={{ color: "var(--color-primary)" }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="text-primary"
                    >
                        Trading
                    </motion.span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="max-w-2xl text-lg md:text-xl text-on-surface-variant font-light mb-12 leading-relaxed bg-white/10 backdrop-blur-[2px] rounded-lg p-2"
                >
                    Connect your broker and execute strategies with institutional-grade precision. Architected for the modern algorithmic trader.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-5 items-center"
                >
                    <button
                        onClick={() => router.push("/login")}
                        className="px-10 py-4 bg-primary text-white font-bold rounded hover:bg-primary-dim transition-all duration-300 uppercase tracking-widest text-xs shadow-lg shadow-primary/30">
                        Get Started
                    </button>
                    <button className="px-10 py-4 text-on-surface border border-outline-variant hover:bg-white transition-colors rounded font-bold uppercase tracking-widest text-xs backdrop-blur-sm">
                        View Documentation
                    </button>
                </motion.div>
            </motion.div>
        </section>
    )
};

const Ticker = () => {
    const assets = [
        { pair: "BTC/USD", price: "64,291.50", change: "+1.42%", up: true },
        { pair: "ETH/USD", price: "3,421.12", change: "+0.85%", up: true },
        { pair: "SPX", price: "5,241.53", change: "-0.21%", up: false },
        { pair: "NDX", price: "18,321.40", change: "+0.64%", up: true },
        { pair: "XAU/USD", price: "2,341.20", change: "+0.12%", up: true },
        { pair: "OIL/USD", price: "82.14", change: "-1.45%", up: false },
    ];

    return (
        <div className="fixed bottom-0 w-full bg-surface/95 backdrop-blur-xl border-t border-surface-container-highest py-3 overflow-hidden z-40">
            <div className="animate-marquee">
                {[...assets, ...assets, ...assets].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 px-8 tabular text-[11px] uppercase tracking-wider">
                        <span className="text-on-surface font-black">{item.pair}</span>
                        <span className="text-on-surface-variant">{item.price}</span>
                        <span className={item.up ? "text-primary font-bold" : "text-error-dim font-bold"}>
                            {item.change}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Features = () => (
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
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt3H2vOBci9Tt-gOqkHOWDP2lyVmJJM8Yclp2iEtWziRCqy8et_nUc_PiXTyeqaQsUlE638hOiN_5tZBEK6wAfZt5NcLpWGTTKqqj73Ju1dQ1sTsvLnhQG_yJkFdE1FQr-XKTQAqY2y3cA0vTPAQZF2X0_axVYS4FymQIW037Q1iNveF9XV6UkApzcck-CoGFOQ8RDOQ_F6RyzIWvVOahTIOY3hAFarDWhqNpgoDywYP6xL0QXR95EZblDE3O7LyDPLDzMZQs1nRI"
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
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5NIyeoEARIkfGzguYeNS6xnJLazduB_E_w0PGpEKc0VRTiq1Rhl0V5TXGYw9HBYJ9MvRZdnYC_p5opKlOfMuhF5qq-aUz1kiAffp-9J9I-Jf97SbZUBvJ6-nZPbRt4Y9xTrVFBiHnhmcMxIqiKeMf3qMCyMPKeS4xNcR2p22frwuHFZdX3rUMaWYWVB11Qd8qbLjiHxw8yx0dq012wCf2j4xEykXzLhI9BrgHOQwvzAus_F_CINVUDVVdI5d8BfyGhUK5g6-mvvo"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-surface-container via-surface-container/10 to-transparent" />
                </div>
            </div>
        </div>
    </section>
);

const Security = () => (
    <section className="py-24 bg-surface-container-low border-y border-surface-container-highest">
        <div className="max-w-7xl mx-auto px-8 flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1">
                <div className="relative inline-block mb-12">
                    <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-primary" />
                    <h2 className="text-5xl md:text-6xl font-black text-on-surface leading-[0.9]">Secure.<br />Stateless.<br />Scalable.</h2>
                </div>
                <p className="text-on-surface-variant text-lg font-light leading-relaxed mb-10">
                    Our cloud-agnostic execution engine allows for horizontal scaling during high-volatility events, ensuring your strategies remain active when they are needed most.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <ShieldCheck className="text-primary" size={18} />
                            <h4 className="text-primary font-bold text-xs uppercase tracking-widest">Security</h4>
                        </div>
                        <p className="text-[13px] text-on-surface-variant leading-relaxed font-light">Hardware security modules (HSM) for API key storage and transaction signing.</p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Cpu className="text-primary" size={18} />
                            <h4 className="text-primary font-bold text-xs uppercase tracking-widest">Backtesting</h4>
                        </div>
                        <p className="text-[13px] text-on-surface-variant leading-relaxed font-light">10 years of tick-by-tick historical data available for strategy validation.</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 relative">
                <div className="rounded-xl overflow-hidden border border-outline-variant/10 shadow-2xl relative group">
                    <img
                        className="w-full opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 cursor-pointer"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-gJ5gf7MpyZX-UOHuqly5GR2YQ6lsnRTyFDz4ji3DpsEYCZokU1fhM3-4PQsRBhBOG0_N0pCGx1IkE5B5nEajek0f64FDjb3de7oodM8VchUm7dOZ-DMDoQmUhETvlbQLzVdWwUOPoia16hvOWTYXX_PvjJ0i0pEJC1sO6saHo4ewKw3thUSm4kJLXYNYkqgL6xJQ7zW4IzFChgiNord_ANdklhD_oRQ4IuU8LO6d4nHNg2lcOS6LBLsLzzoVUy9pvrKUkuZ-VAk"
                        referrerPolicy="no-referrer"
                    />
                    {/* Stats Overlay */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="absolute -bottom-6 -left-6 bg-surface-container-highest p-6 rounded border border-outline-variant/30 backdrop-blur-xl bg-opacity-90 shadow-2xl"
                    >
                        <div className="flex items-center gap-5">
                            <div className="text-4xl font-black text-primary tabular">92M+</div>
                            <div className="text-[10px] uppercase leading-tight font-black text-on-surface-variant tracking-wider">
                                Daily <br /> Orders processed
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    </section>
);

const CTA = () => (
    <section className="py-48 px-8 flex flex-col items-center text-center">
        <h2 className="text-5xl md:text-7xl font-black text-on-surface mb-8 tracking-tight">Ready to execute?</h2>
        <p className="text-on-surface-variant max-w-xl text-lg mb-16 font-light leading-relaxed">
            Join the top-tier algorithmic trading firms utilizing the Obsidian framework for global market execution.
        </p>
        <div className="group relative">
            <div className="absolute inset-0 bg-primary blur-2xl opacity-10 group-hover:opacity-30 transition-opacity" />
            <button className="relative px-16 py-6 bg-background border border-primary/40 hover:bg-surface-container-highest transition-all rounded text-xs font-black uppercase tracking-[0.4em] text-on-surface">
                Create Institutional Account
            </button>
        </div>
    </section>
);

const Footer = () => (
    <footer className="w-full py-16 px-8 border-t border-surface-container-highest bg-surface-container">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-[0.2em] text-center md:text-left">
                © 2024 OBSIDIAN ARCHITECT. ENGINEERED FOR PRECISION. <br />
                Built for institutional algorithmic trading.
            </div>
            <div className="flex flex-wrap justify-center gap-10">
                {['Institutional API', 'System Status', 'Privacy Protocol', 'Terms Of Execution'].map((link) => (
                    <a key={link} href="#" className="text-[10px] font-bold text-on-surface-variant hover:text-primary transition-colors uppercase tracking-[0.2em]">
                        {link}
                    </a>
                ))}
            </div>
        </div>
    </footer>
);

// --- Main App ---

export default function Homepage() {
    return (
        <div className="min-h-screen selection:bg-primary/30">
            <Navbar />
            <main className="pb-24">
                <Hero />
                <Features />
                <Security />
                <CTA />
            </main>
            <Ticker />
            <Footer />
        </div>
    );
}

