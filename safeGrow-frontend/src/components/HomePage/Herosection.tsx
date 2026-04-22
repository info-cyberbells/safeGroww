"use client"

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";


export default function Hero () {
    const router = useRouter();
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
            {/* Full Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop"
                    alt="Stock Market Trading"
                    className="w-full h-full object-cover "
                    referrerPolicy="no-referrer"
                />
                {/* <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/40 to-white" /> */}
            </div>

            {/* Background Glows */}
            {/* <div className="absolute inset-0 pointer-events-none z-1">
                <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-primary-container/30 blur-[100px] rounded-full" />
            </div> */}

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center"
            >

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-[-0.04em] leading-[0.85] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)] mb-10 "
                >
                    Automate Your <br />
                    <motion.span
                        initial={{ color: "var(--color-on-surface)" }}
                        animate={{ color: "var(--color-primary)" }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="text-primary "
                    >
                        Trading
                    </motion.span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="max-w-2xl text-lg md:text-xl text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)] font-light mb-12 leading-relaxed bg-black/20 backdrop-blur-[2px] rounded-lg p-2"
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
                  
                </motion.div>
            </motion.div>
        </section>
    )
};