import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/auth.slice";
import brokerReducer from "../features/BrokerLogin/brokerLoginSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        broker: brokerReducer,
    }
});

export default store;