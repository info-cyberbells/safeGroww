import fyers from "./fyers.instance.js";

const setToken = (accessToken: string): void => {
    fyers.setAppId(process.env.FYERS_CLIENT_ID!);
    fyers.setAccessToken(accessToken);
    console.log("AppId:", process.env.FYERS_CLIENT_ID);
    console.log("Full token:", `${process.env.FYERS_CLIENT_ID}:${accessToken}`);
};


export const getFunds = async (accessToken: string): Promise<any> => {
    setToken(accessToken);
    const response = await fyers.get_funds();
    console.log("Funds response:", response);
    return response.data;
};

export const getHoldings = async (accessToken: string): Promise<any> => {
    setToken(accessToken);
    const response = await fyers.get_holdings();
    console.log("Holdings response:", response);
    return response.holdings;
};

export const getPositions = async (accessToken: string): Promise<any> => {
    setToken(accessToken);
    const response = await fyers.get_positions();
    console.log("Positions response:", response);
    return response.netPositions;
};

export const getOrders = async (accessToken: string): Promise<any> => {
    setToken(accessToken);
    const response = await fyers.get_orders();
    console.log("Orders response:", response);
    return response.orderBook;
};

export const getTradebook = async (accessToken: string): Promise<any> => {
    setToken(accessToken);
    const response = await fyers.get_tradebook();
    console.log("Tradebook response:", response);
    return response.tradeBook;
};

export const getQuotes = async (accessToken: string, symbols: string[]): Promise<any> => {
    setToken(accessToken);
    const response = await fyers.get_quotes(symbols.join(","));
    return response;
};

export const getMarketDepth = async (accessToken: string, symbols: string[]): Promise<any> => {
    setToken(accessToken);
    const response = await fyers.get_market_depth(symbols.join(","));
    return response;
};