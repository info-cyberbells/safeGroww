import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, BrokerType } from "./authTypes";

const initialState: AuthState = {
    selectedBroker: null,
    isRedirecting: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setBroker(state, action: PayloadAction<BrokerType>) {
            state.selectedBroker = action.payload;
            state.error = null;
        },

        // Called when the API call starts
        setRedirecting(state, action: PayloadAction<boolean>) {
            state.isRedirecting = action.payload;
        },

        // Called when the API call fails
        setAuthError(state, action: PayloadAction<string>) {
            state.error = action.payload;
            state.isRedirecting = false;
        },

        // Resets everything — useful on logout or back navigation
        resetAuth() {
            return initialState;
        },
    },
});

export const { setBroker, setRedirecting, setAuthError, resetAuth } =
    authSlice.actions;

export default authSlice.reducer;