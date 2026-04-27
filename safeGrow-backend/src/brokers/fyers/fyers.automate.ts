import axios from "axios";
import { generate } from "otplib";
import crypto from "crypto";

/**
 * automateFyersLogin
 * Performs a headless login to Fyers to obtain an auth_code.
 * This uses the TOTP + PIN flow.
 */
export const automateFyersLogin = async () => {
    const fyId = process.env.FYERS_ID;
    const pin = process.env.FYERS_PIN;
    const totpSecret = process.env.FYERS_TOTP_SECRET;
    const appId = process.env.FYERS_CLIENT_ID;
    const secretKey = process.env.FYERS_SECRET;
    const redirectUri = process.env.FYERS_REDIRECT_URI;

    if (!fyId || !pin || !totpSecret || !appId || !secretKey || !redirectUri) {
        throw new Error("[Fyers Auto] Missing credentials in .env (FYERS_ID, FYERS_PIN, FYERS_TOTP_SECRET)");
    }

    console.log("[Fyers Auto] Starting automated login for:", fyId);

    try {
        // 1. Step 1: Send Login OTP (FY_ID)
        // This initiates the login and returns a request_key
        const step1Response = await axios.post("https://api.fyers.in/api/v2/send-login-otp-v2", {
            fy_id: fyId,
            app_id: "2" // Constant for API login
        });

        if (step1Response.data.s !== "ok") {
            throw new Error(`Step 1 failed: ${step1Response.data.ms}`);
        }

        const requestKey = step1Response.data.request_key;
        console.log("[Fyers Auto] Step 1 Success (Received Request Key)");

        // 2. Step 2: Verify TOTP
        const totpCode = await generate({ secret: totpSecret });
        const step2Response = await axios.post("https://api.fyers.in/api/v2/verify-otp-v2", {
            request_key: requestKey,
            otp: totpCode
        });

        if (step2Response.data.s !== "ok") {
            throw new Error(`Step 2 failed: ${step2Response.data.ms}`);
        }

        const requestKey2 = step2Response.data.request_key;
        console.log("[Fyers Auto] Step 2 Success (TOTP Verified)");

        // 3. Step 3: Verify PIN
        const step3Response = await axios.post("https://api.fyers.in/api/v2/verify-pin-v2", {
            request_key: requestKey2,
            pin: pin
        });

        if (step3Response.data.s !== "ok") {
            throw new Error(`Step 3 failed: ${step3Response.data.ms}`);
        }

        const accessTokenInternal = step3Response.data.data.access_token;
        console.log("[Fyers Auto] Step 3 Success (PIN Verified)");

        // 4. Step 4: Generate Auth Code
        // Now we use the internal access token to get the standard OAuth auth_code
        // We need to match the signature Fyers expects for the redirect
        const appIdWithoutSuffix = appId.split("-")[0]; // e.g. "34C4EPG8FX"
        
        const response = await axios.post("https://api-t1.fyers.in/api/v3/generate-authcode", {
            client_id: appId,
            redirect_uri: redirectUri,
            response_type: "code",
            state: "system", // We use 'system' state to tell our callback this is for market data
            app_id: appIdWithoutSuffix
        }, {
            headers: {
                Authorization: `Bearer ${accessTokenInternal}`
            }
        });

        if (response.data.s !== "ok" || !response.data.code) {
             // Sometimes Fyers returns a redirect URL instead of a JSON with 'code'
             // If we get an error or no code, we might need to follow the redirect if it's 302
             console.error("[Fyers Auto] Step 4 Response:", response.data);
             throw new Error(`Step 4 failed: ${response.data.ms || "No code received"}`);
        }

        const authCode = response.data.code;
        console.log("[Fyers Auto] ✅ Successfully obtained Auth Code");

        return authCode;

    } catch (err: any) {
        console.error("[Fyers Auto] Login failed:", err.response?.data || err.message);
        throw err;
    }
};
