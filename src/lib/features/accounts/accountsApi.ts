import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/src/lib/features/baseQueryWithReauth";

export interface Account {
  id?: number;
  login: string;
  email: string | null;
  name: string;
  is_staff?: undefined;
  is_active: boolean;
  counterparty: string | null;
}

export const accountsApi = createApi({
  reducerPath: "accountsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Accounts"],

  endpoints: (builder) => ({
    getUser: builder.query<Account, void>({
      query: () => ({
        url: "/accounts/me",
      }),
      providesTags: ["Accounts"],
    }),

    passwordReset: builder.mutation({
      query: (email) => ({
        url: "/accounts/password_reset/",
        method: "POST",
        body: email,
      }),
      invalidatesTags: ["Accounts"],
    }),

    passwordResetValidateToken: builder.mutation({
      query: (token) => ({
        url: "/accounts/password_reset/validate_token/",
        method: "POST",
        body: {token},
      }),
      invalidatesTags: ["Accounts"],
    }),

    passwordResetConfirm: builder.mutation({
      query: ({ token, password }) => ({
        url: "/accounts/password_reset/confirm/",
        method: "POST",
        body: { token, password },
      }),
      invalidatesTags: ["Accounts"],
    }),
    signUpConfirm: builder.mutation({
      query: ({ token, password }) => ({
        url: "/accounts/sign-up/confirm/",
        method: "POST",
        body: { token, password },
      }),
      invalidatesTags: ["Accounts"],
    }),
  }),
});

export const {
  useGetUserQuery,
  usePasswordResetMutation,
  usePasswordResetValidateTokenMutation,
  usePasswordResetConfirmMutation,
    useSignUpConfirmMutation
} = accountsApi;
