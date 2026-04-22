


export default function CTA () {
return(
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
)
}