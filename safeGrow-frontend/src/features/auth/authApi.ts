import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { AuthLoginResponse, BrokerType } from "./authTypes";

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  }),

  endpoints: (builder) => ({
    // GET /api/auth/login?broker=<BrokerType>
    getBrokerLoginUrl: builder.query<AuthLoginResponse, BrokerType>({
      query: (broker) =>
        `${process.env.NEXT_PUBLIC_AUTH_LOGIN_ROUTE}?broker=${broker}`,
    }),
  }),
});

export const { useLazyGetBrokerLoginUrlQuery } = authApi;