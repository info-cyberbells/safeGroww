export type BrokerType = "fyers" | "5paisa" | "zerodha" | "google";

export interface AuthLoginResponse {
    success: boolean;
    url: string;
}

// The Redux state shape for the auth slice
export interface AuthState {
    selectedBroker: BrokerType | null; // which broker the user clicked
    isRedirecting: boolean;            // true while API call is in flight
    error: string | null;             // error message if the call failed
}