import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/src/features/auth/authApi";
import authReducer from "@/src/features/auth/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,

    [authApi.reducerPath]: authApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;