import xtsMarketData from "./xts.instance.js";

let token: string = "";
let userID: string = "";

export const loginXTS = async (appKey?: string, secretKey?: string) => {
    // No browser redirect — just appKey + secretKey
    const loginRequest = {
        appKey:    appKey || process.env.XTS_APP_KEY!,
        secretKey: secretKey || process.env.XTS_SECRET_KEY!,
    };

    const response = await xtsMarketData.logIn(loginRequest);

    console.log("XTS Login response:", response);

    if (response.type === "success") {
        token  = response.result.token;
        userID = response.result.userID;
        console.log("XTS token generated:", token);
    } else {
        throw new Error("XTS Login failed: " + JSON.stringify(response));
    }

    return { token, userID };
};

export const getXTSToken  = () => token;
export const getXTSUserID = () => userID;