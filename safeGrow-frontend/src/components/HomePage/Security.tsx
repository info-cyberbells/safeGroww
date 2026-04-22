import { motion } from "framer-motion"
import { Cpu, ShieldCheck } from "lucide-react"

export default function Security() {
    return (
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
)};
