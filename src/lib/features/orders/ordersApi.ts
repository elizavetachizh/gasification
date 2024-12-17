import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/src/lib/features/baseQueryWithReauth";
import { Dayjs } from "dayjs";

export interface Order {
  construction_object?: string | null;
  selected_date: string;
  applicant: string;
  order_type?: string | null;
  status: string;
}

export interface OrderOriginal
  extends Omit<Order, "construction_object" | "order_type"> {
  id: number;
  created_at: string;
  construction_object?: { code: string }; // Переопределяем тип
  order_type?: { order_type: string }; // Переопределяем тип
  status_history?: {
    status: string;
    on_date: string;
  }[]; // Добавляем новое свойство
}

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    getOrders: builder.query<OrderOriginal[], string | undefined>({
      query: (status) => ({
        url: "/orders",
        params: { status }, // Параметр status передается напрямую
      }),
      providesTags: ["Orders"],
    }),
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (newOrder) => ({
        url: "/orders/",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["Orders"],
    }),
    //подтверждение заявки СЗ
    acceptedOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/orders/${id}/accept/`,
        method: "POST",
      }),
      invalidatesTags: ["Orders"],
    }),
    //подтверждение переноса заявки на новую дату клиентом
    agreedOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/orders/${id}/agree/`,
        method: "POST",
      }),
      invalidatesTags: ["Orders"],
    }),
    //предложение переноса заявки на новую дату СЗ
    onConfirmedOrder: builder.mutation<
      Order,
      { id: number; on_date: string | null }
    >({
      query: ({ id, on_date }) => ({
        url: `/orders/${id}/on_confirm/`,
        method: "POST",
        body: { on_date: on_date },
      }),
      invalidatesTags: ["Orders"],
    }),
    //отклонение переноса заявки клиентом на новую дату
    rejectedOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/orders/${id}/reject/`,
        method: "POST",
      }),
      invalidatesTags: ["Orders"],
    }),
    //отмена заявки клиентом
    canceledOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/orders/${id}/cancel/`,
        method: "POST",
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useCreateOrderMutation,
  useAcceptedOrderMutation,
  useAgreedOrderMutation,
  useOnConfirmedOrderMutation,
  useRejectedOrderMutation,
  useCanceledOrderMutation,
} = ordersApi;
