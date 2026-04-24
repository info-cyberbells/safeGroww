import xtsMarketData from "./xts.instance.js";

/**
 * Formats a date string (YYYY-MM-DD) into XTS expected format (MMM DD YYYY HHmmss)
 */
const formatXTSDate = (dateStr: string, isEnd = false) => {
    const d = new Date(dateStr);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    const time = isEnd ? "153000" : "091500"; // Market hours 9:15 to 15:30
    return `${month} ${day} ${year} ${time}`;
};

export const fetchXTSHistoricalData = async (
    exchangeSegment: string,
    exchangeInstrumentID: string,
    startTime: string,
    endTime: string,
    compressionValue: number
) => {
    // 🕯️ Convert dates to XTS specific format: "Apr 20 2026 091500"
    const xtsStart = formatXTSDate(startTime, false);
    const xtsEnd = formatXTSDate(endTime, true);

    console.log(`[XTS History] Requesting: ${xtsStart} to ${xtsEnd}`);

    const response = await xtsMarketData.getOHLC({
        exchangeSegment,
        exchangeInstrumentID,
        startTime: xtsStart,
        endTime: xtsEnd,
        compressionValue,
    });

    if (response.type !== "success") {
        console.error("XTS Historical error:", response);
        return [];
    }

    // XTS returns data as a comma-separated string in result.dataReponse
    // Format: "timestamp,o,h,l,c,v|timestamp,o,h,l,c,v"
    const rawData = response.result?.dataReponse;
    if (!rawData || typeof rawData !== "string") return [];

    return rawData.split("|").map(bar => {
        const [ts, o, h, l, c, v] = bar.split(",");
        return {
            timestamp: parseInt(ts),
            open: parseFloat(o),
            high: parseFloat(h),
            low: parseFloat(l),
            close: parseFloat(c),
            volume: parseInt(v)
        };
    });
};