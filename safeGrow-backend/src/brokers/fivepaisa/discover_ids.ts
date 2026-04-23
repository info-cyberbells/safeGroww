import "dotenv/config";
import xtsMarketData from "./xts.instance.js";
import { loginXTS } from "./xts.auth.js";

async function discover() {
    console.log("--- XTS ID DISCOVERY START ---");
    const session = await loginXTS();
    
    // Set token in the instance for subsequent calls
    (xtsMarketData as any).token = session.token;
    (xtsMarketData as any).userID = session.userID;
    (xtsMarketData as any).isLoggedIn = true;

    const symbols = [
        "Nifty 50", "Nifty Bank", "SBIN", "RELIANCE", "HDFCBANK", 
        "ICICIBANK", "AXISBANK", "KOTAKBANK", "TCS", "INFY", 
        "WIPRO", "HCLTECH", "MARUTI", "TMPV", "M&M", 
        "BAJAJ-AUTO", "BAJFINANCE", "ONGC", "NTPC", "POWERGRID", 
        "SUNPHARMA", "DRREDDY", "CIPLA"
    ];

    for (const s of symbols) {
        try {
            // Method is searchInstrument (singular)
            const res = await (xtsMarketData as any).searchInstrument({
                searchString: s,
                source: "Web"
            });
            if (res.type === "success" && res.result.length > 0) {
                console.log(`SYMBOL: ${s}`);
                res.result.slice(0, 3).forEach((r: any) => {
                    console.log(`  > ID: ${r.ExchangeSegment}:${r.ExchangeInstrumentID} | Name: ${r.Description} | Seg: ${r.ExchangeSegment}`);
                });
            } else {
                console.log(`No results for ${s}`);
            }
        } catch (e: any) {
            console.log(`Failed for ${s}: ${e.message}`);
        }
    }
    console.log("--- XTS ID DISCOVERY END ---");
}

discover();
