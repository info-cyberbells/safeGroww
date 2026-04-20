// @ts-ignore
import FyersApi from "fyers-api-v3/apiService/apiService.js";

const fyers = new FyersApi();

// Ensure APP ID is set whenever we use the instance
export const ensureFyersInit = () => {
    if (process.env.FYERS_CLIENT_ID) {
        fyers.setAppId(process.env.FYERS_CLIENT_ID);
        fyers.setRedirectUrl(process.env.FYERS_REDIRECT_URI || "");
    } else {
        console.error("Critical: FYERS_CLIENT_ID not found in environment!");
    }
};

// Initial call
ensureFyersInit();

export default fyers;