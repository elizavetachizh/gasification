import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { backend } from "@/src/const/backend";
import { RootState } from "@/src/lib/store";

export interface OrderType {
  guid: number;
  order_type: string;
  id: number;
}

export const orderTypesApi = createApi({
  reducerPath: "orderTypesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${backend}/orders`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.accessToken;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["orderTypes"],
  endpoints: (builder) => ({
    getOrderTypes: builder.query<OrderType[], void>({
      query: () => ({
        url: "/order-types",
      }),
      providesTags: ["orderTypes"],
    }),
  }),
});

export const { useGetOrderTypesQuery } = orderTypesApi;
