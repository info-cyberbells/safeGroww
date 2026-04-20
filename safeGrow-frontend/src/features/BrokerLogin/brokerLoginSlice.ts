import { createSlice } from "@reduxjs/toolkit";

interface BrokerState {
    loading: boolean;
    error: string | null;
    currentBroker: string | null;
}

const initialState: BrokerState = {
    loading: false,
    error: null,
    currentBroker: null,
};

const brokerLoginSlice = createSlice({
    name: "broker",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setBroker: (state, action) => {
            state.currentBroker = action.payload;
        },
    },
});

export const { setLoading, setError, setBroker } = brokerLoginSlice.actions;
export default brokerLoginSlice.reducer;
