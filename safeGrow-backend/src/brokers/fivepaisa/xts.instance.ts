// @ts-ignore
import { XtsMarketDataAPI } from "xts-marketdata-api";

const BASE_URL = process.env.XTS_BASE_URL 
    || "https://developers.symphonyfintech.in/apibinarymarketdata";

const xtsMarketData = new XtsMarketDataAPI(BASE_URL);

export default xtsMarketData;