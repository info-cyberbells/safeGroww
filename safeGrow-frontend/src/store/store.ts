import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/src/features/auth/authApi";
import { dashboardApi } from "@/src/features/dashboard/dashboardApi";
import authReducer from "@/src/features/auth/authSlice";
import marketReducer from "@/src/features/market/marketSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    market: marketReducer,

    [authApi.reducerPath]: authApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, dashboardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;