

export default function Footer() {
    return (
         <footer className="w-full py-16 px-8 border-t border-surface-container-highest bg-surface-container">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-[0.2em] text-center md:text-left">
                © 2026 SafeGrow ARCHITECT. ENGINEERED FOR PRECISION. <br />
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
    )
}