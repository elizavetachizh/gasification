import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/src/lib/features/baseQueryWithReauth";

export interface Client {
  email: string;
  password: string;
  counterparty: number;
  id: 2;
  is_active: string;
  is_approved: boolean | undefined;
  last_login: null;
  login: string;
  name: string;
}

export interface ClientsInterface {
  result: Array<Client>;
  count?: number;
}

export interface UpdateClient {
  id: number;
  email: string;
  password: string;
  counterparty: number;
}

interface ClientCreate {
  email: string;
  password: string;
  counterparty: number;
}

export const clientsApi = createApi({
  reducerPath: "clientsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Clients"],

  endpoints: (builder) => ({
    getClients: builder.query<
      ClientsInterface | undefined,
      {
        search?: string;
        page?: number;
        page_size?: number;
        is_active?: boolean;
        ordering?: string;
      }
    >({
      query: (params) => ({
        url: "/accounts/clients",
        params: {
          page: params.page,
          page_size: params.page_size,
          search: params.search,
          is_active: params.is_active,
          ordering: params.ordering,
        },
      }),
      providesTags: ["Clients"],
    }),
    getClient: builder.query<Client, number>({
      query: (id) => ({
        url: `/accounts/clients/${id}/`,
      }),
      providesTags: ["Clients"],
    }),
    resendEmailClient: builder.mutation<void, number>({
      query: (id) => ({
        url: `/accounts/clients/${id}/resend-signup-email/`,
        method: "POST",
      }),
      invalidatesTags: ["Clients"],
    }),
    createClient: builder.mutation<ClientCreate, Partial<ClientCreate>>({
      query: (newClient) => ({
        url: "/accounts/clients/",
        method: "POST",
        body: newClient,
      }),
      invalidatesTags: ["Clients"],
    }),
    blockClient: builder.mutation<void, number>({
      query: (id) => ({
        url: `/accounts/clients/${id}/block/`,
        method: "POST",
      }),
      invalidatesTags: ["Clients"],
    }),
    unblockClient: builder.mutation<void, number>({
      query: (id) => ({
        url: `/accounts/clients/${id}/unblock/`,
        method: "POST",
      }),
      invalidatesTags: ["Clients"],
    }),
    putClient: builder.mutation<UpdateClient, Partial<UpdateClient>>({
      query: (client) => ({
        url: `/accounts/clients${client.id}/`,
        method: "PUT",
        body: client,
      }),
      invalidatesTags: ["Clients"],
    }),
    deleteClient: builder.mutation<void, number>({
      query: (id) => ({
        url: `/accounts/clients/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Clients"],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientQuery,
  usePutClientMutation,
  useResendEmailClientMutation,
  useDeleteClientMutation,
  useCreateClientMutation,
  useBlockClientMutation,
  useUnblockClientMutation,
} = clientsApi;
