import fyers from "./fyers.instance.js";

export const generateLoginUrl = (state?: string) => {
    // fyers-api-v3 generateAuthCode takes:
    // (redirect_uri, state, secret_key, client_id, app_type) 
    // but the SDK signature is often different depending on version. 
    // Setting state via additional param if supported
    return fyers.generateAuthCode();
};

export const getAccessToken = async (authCode: string) => {
    const response = await fyers.generate_access_token({
        client_id: process.env.FYERS_CLIENT_ID,
        secret_key: process.env.FYERS_SECRET,
        auth_code: authCode,
        grant_type: "authorization_code",
    });

    console.log("Actual access token:", response.access_token);
    console.log("Token response:", response);
    return response;
};

export const getUserProfile = async (accessToken: string) => {
    fyers.setAppId(process.env.FYERS_CLIENT_ID!);
    fyers.setAccessToken(accessToken);
    const response = await fyers.get_profile();
    console.log("Profile response:", response);
    return response.data;
};