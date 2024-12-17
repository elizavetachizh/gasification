import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/src/lib/features/baseQueryWithReauth";

export interface Client {
  email: string;
  password: string;
  counterparty: number;
  id: 2;
  is_active: true;
  last_login: null;
  login: string;
  name: string;
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
    getClients: builder.query<Client[], void>({
      query: () => ({
        url: "/accounts/clients",
      }),
      providesTags: ["Clients"],
    }),
    getClient: builder.query<Client, number>({
      query: (id) => ({
        url: `/accounts/clients/${id}/`,
      }),
      providesTags: ["Clients"],
    }),
    createClient: builder.mutation<ClientCreate, Partial<ClientCreate>>({
      query: (newClient) => ({
        url: "/accounts/clients/",
        method: "POST",
        body: newClient,
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
    deleteClient: builder.mutation<Client, Partial<Client>>({
      query: (id) => ({
        url: `/accounts/clients${id}/`,
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
  useDeleteClientMutation,
  useCreateClientMutation,
} = clientsApi;
