import { useEffect, useState } from "react";

export default function LivePrice() {
    const [data, setData] = useState<Record<string, any>>({});

    useEffect(() => {
        const poll = () =>
            fetch("http://localhost:5000/api/market/live")
                .then((r) => r.json())
                .then((res) => setData(res.data));

        poll(); // fetch immediately
        const id = setInterval(poll, 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div>
            <h2>Live Market Data</h2>
            {Object.keys(data).length === 0 && <p>Waiting for ticks...</p>}
            {Object.entries(data).map(([symbol, tick]) => (
                <div key={symbol} style={{ border: "1px solid #ccc", margin: 8, padding: 12 }}>
                    <strong>{symbol}</strong>
                    <div>LTP: ₹{tick.ltp}</div>
                    <div>Change: {tick.ch} ({tick.chp}%)</div>
                    {tick.vol_traded_today !== undefined && (
                        <div>Vol: {tick.vol_traded_today}</div>
                    )}
                </div>
            ))}
        </div>
    );
}