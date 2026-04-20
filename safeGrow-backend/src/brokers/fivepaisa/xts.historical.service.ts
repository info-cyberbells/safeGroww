import xtsMarketData from "./xts.instance.js";

export const fetchXTSHistoricalData = async (
    exchangeSegment: string,
    exchangeInstrumentID: string,
    startTime: string,
    endTime: string,
    compressionValue: number  // 1=1min, 5=5min, 60=1hr, 1D=daily
) => {
    const response = await xtsMarketData.getOHLC({
        exchangeSegment,
        exchangeInstrumentID,
        startTime,   // "Jan 01 2026 000000"
        endTime,     // "Apr 20 2026 235959"
        compressionValue,
    });

    console.log("XTS Historical response:", response);
    return response.result?.dataReponse ?? [];
};