


export default function Ticker () {
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