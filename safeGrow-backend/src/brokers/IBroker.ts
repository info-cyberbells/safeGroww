export interface Tick {
    symbol: string;
    ltp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
    ch?: number;
    chp?: number;
    timestamp?: number;
}

export interface Candle {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

// Every broker MUST implement these functions
export interface IBroker {
    // live data
    startLive(): Promise<void>;
    getLatestTick(symbol?: string): Record<string, Tick> | Tick | null;

    // market data
    getQuotes(accessToken: string, symbols: string[]): Promise<any>;
    getMarketDepth(accessToken: string, symbols: string[]): Promise<any>;
    getHistory(
        accessToken: string,
        symbol: string,
        resolution: string,
        from?: string,
        to?: string
    ): Promise<any>;

    // auth
    generateLoginUrl(): string;
    getAccessToken(authCode: string, password?: string): Promise<any>;
    getUserProfile(accessToken: string): Promise<any>;
    getFunds(accessToken: string): Promise<any>;
    getHoldings(accessToken: string): Promise<any>;
    getPositions(accessToken: string): Promise<any>;
    getOrders(accessToken: string): Promise<any>;
    getTradebook(accessToken: string): Promise<any>;
}