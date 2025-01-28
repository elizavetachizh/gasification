import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { backend } from "@/src/const/backend";
import { setAccessToken } from "@/src/lib/slices/authSlice";

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export const accountsTokenApi = createApi({
  reducerPath: "accountsTokenApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${backend}` }),
  tagTypes: ["Token"],

  endpoints: (builder) => ({
    loginAccount: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/accounts/token/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Token"],
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          const newToken = data.access;
          dispatch(setAccessToken(newToken));
        } catch {
          console.log("Login failed");
        }
      },
    }),
    refreshAccessToken: builder.mutation({
      query: ({ refreshToken }) => ({
        url: "/accounts/token/refresh",
        method: "POST",
        body: refreshToken,
      }),
      invalidatesTags: ["Token"],
    }),
  }),
});

export const { useLoginAccountMutation, useRefreshAccessTokenMutation } =
  accountsTokenApi;
