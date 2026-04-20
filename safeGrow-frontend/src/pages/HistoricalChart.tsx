import { useEffect, useState } from "react";

type Candle = [number, number, number, number, number, number];

export default function HistoricalChart() {
    const [candles, setCandles] = useState<Candle[]>([]);
    const [symbol, setSymbol] = useState("NSE:SBIN-EQ");
    const [resolution, setRes] = useState("D");
    const [from, setFrom] = useState("2026-01-01");
    const [to, setTo] = useState(() => new Date().toISOString().split("T")[0]);

    const fetchData = () => {
        fetch(`http://localhost:5000/api/market/historical?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`)
            .then(r => r.json())
            .then(res => setCandles(res.data ?? []));
    };

    useEffect(() => { fetchData(); }, []); // fetch on mount

    return (
        <div>
            <h2>Historical Data</h2>

            {/* Controls */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                <input
                    value={symbol}
                    onChange={e => setSymbol(e.target.value)}
                    placeholder="Symbol"
                />

                <select value={resolution} onChange={e => setRes(e.target.value)}>
                    <option value="1">1 min</option>
                    <option value="5">5 min</option>
                    <option value="15">15 min</option>
                    <option value="60">1 hour</option>
                    <option value="D">Daily</option>
                    <option value="W">Weekly</option>
                    <option value="M">Monthly</option>
                </select>

                <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
                <input type="date" value={to} onChange={e => setTo(e.target.value)} />

                <button onClick={fetchData}>Fetch</button>
            </div>

            {/* Table */}
            <table>
                <thead>
                    <tr><th>Date</th><th>Open</th><th>High</th><th>Low</th><th>Close</th><th>Volume</th></tr>
                </thead>
                <tbody>
                    {candles.map(([ts, o, h, l, c, v]) => (
                        <tr key={ts}>
                            <td>{new Date(ts * 1000).toLocaleDateString()}</td>
                            <td>{o}</td><td>{h}</td><td>{l}</td><td>{c}</td>
                            <td>{v ?? "—"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}