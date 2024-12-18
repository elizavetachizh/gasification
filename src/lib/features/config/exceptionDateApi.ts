import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/src/lib/features/baseQueryWithReauth";

export interface ExceptionDateInterface {
  on_date: string;
  order_count_per_day: number | null;
}

export interface ConfigStatsInterface {
  date: string | null;
  order_count: number;
}

export interface ConfigSetupInterface {
  order_count_per_day: number | null;
  order_count_friday: number | null;
  time_start: string;
  time_end: string;
}

export interface OrdersAvailableInterface {
  status: boolean;
}

export const exceptionDateApi = createApi({
  reducerPath: "exceptionDateApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["ExceptionDate"],
  endpoints: (builder) => ({
    getConfigStats: builder.query<
      ConfigStatsInterface[],
      { start_date: string | null; end_date: string | null }
    >({
      query: ({ start_date, end_date }) => ({
        url: `/orders/config/stats/?start_date=${start_date}&end_date=${end_date}`,
      }),
      providesTags: ["ExceptionDate"],
    }),
    getConfigSetup: builder.query<ConfigSetupInterface[], void>({
      query: () => ({
        url: "/orders/config/setup",
      }),
      providesTags: ["ExceptionDate"],
    }),
    getOrdersAvailable: builder.query<OrdersAvailableInterface, void>({
      query: () => ({
        url: "/orders/available/",
      }),
      providesTags: ["ExceptionDate"],
    }),
    putConfigSetup: builder.mutation<
      ConfigSetupInterface,
      Partial<ConfigSetupInterface>
    >({
      query: (orderConfigUpdate) => ({
        url: "/orders/config/setup",
        method: "PUT",
        body: orderConfigUpdate,
      }),
      invalidatesTags: ["ExceptionDate"],
    }),
    createExceptionDate: builder.mutation<
      ExceptionDateInterface,
      Partial<ExceptionDateInterface>
    >({
      query: (newOrder) => ({
        url: "/orders/config/set-exception-date",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["ExceptionDate"],
    }),
  }),
});

export const {
  useCreateExceptionDateMutation,
  useGetConfigStatsQuery,
  useGetConfigSetupQuery,
  useGetOrdersAvailableQuery,
  usePutConfigSetupMutation,
} = exceptionDateApi;
