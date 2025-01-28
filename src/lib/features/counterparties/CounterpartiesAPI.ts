import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/src/lib/features/baseQueryWithReauth";

export interface Counterparty {
  id: number;
  guid: string;
  name: string;
}

export const counterpartiesApi = createApi({
  reducerPath: "counterpartiesApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["counterparties"],
  endpoints: (builder) => ({
    getCounterparties: builder.query<Counterparty[], string | void>({
      query: () => ({
        url: "/erp/counterparties",
      }),
      providesTags: ["counterparties"],
    }),
  }),
});

export const { useGetCounterpartiesQuery } = counterpartiesApi;
