import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface DashboardData {
    broker: string;
    profile: any;
    funds: any;
    holdings: any[];
    positions: any[];
    orders: any[];
    tradebook: any[];
}

export const dashboardApi = createApi({
    reducerPath: "dashboardApi",
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
        credentials: "include", // This ensures cookies are sent
    }),
    endpoints: (builder) => ({
        getDashboardData: builder.query<{ success: boolean; data: DashboardData }, void>({
            query: () => process.env.NEXT_PUBLIC_DASHBOARD_DATA_ROUTE as string,
        }),
    }),
});

export const { useGetDashboardDataQuery } = dashboardApi;
