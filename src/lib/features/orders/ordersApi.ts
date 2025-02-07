import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/src/lib/features/baseQueryWithReauth";

export interface Order {
  construction_object?: number | null;
  selected_date: string;
  applicant: string;
  order_type?: number | null;
  status: string;
  phone_number: string;
}

export interface StatusHistoryItem {
  status: string;
  on_date?: string; // Опциональное поле
  created_at?: string; // Опциональное поле
}

export interface OrderOriginal
  extends Omit<Order, "construction_object" | "order_type"> {
  id: number;
  created_at: string;
  on_date?: string;
  construction_object?: {
    code: string;
    address: string;
    work_packages: number[];
  }; // Переопределяем тип
  order_type?: { order_type: string }; // Переопределяем тип
  status_history?: StatusHistoryItem[]; // Добавляем новое свойство
}

export interface OrdersInterface {
  result: Array<OrderOriginal> | never[];
  count?: number;
}

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Orders", "OrdersAvailable"],
  endpoints: (builder) => ({
    getOrders: builder.query<
      OrdersInterface | undefined,
      { status?: string; page?: number; page_size?: number }
    >({
      query: (params) => ({
        url: "/orders",
        params: {
          status: params.status,
          page: params.page,
          page_size: params.page_size,
        }, // Параметр status передается напрямую
      }),
      providesTags: ["Orders"],
    }),
    getCreatedOrdersCount: builder.query<number, void>({
      query: () => ({
        url: "/orders/?status=created",
      }),
      transformResponse: (response: { count: number }) => response.count, // Оставляем только count
    }),
    getAcceptedOrdersCount: builder.query<number, void>({
      query: () => ({
        url: "/orders/?status=accepted",
      }),
      transformResponse: (response: { count: number }) => response.count, // Оставляем только count
    }),
    getOnConfirmOrdersCount: builder.query<number, void>({
      query: () => ({
        url: "/orders/?status=on_confirm",
      }),
      transformResponse: (response: { count: number }) => response.count, // Оставляем только count
    }),
    createOrder: builder.mutation<Order, Partial<Order>>({
      query: (newOrder) => ({
        url: "/orders/",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["Orders", "OrdersAvailable"],
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
        body: { on_date },
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
  useGetCreatedOrdersCountQuery,
    useGetOnConfirmOrdersCountQuery,
    useGetAcceptedOrdersCountQuery,
  useCreateOrderMutation,
  useAcceptedOrderMutation,
  useAgreedOrderMutation,
  useOnConfirmedOrderMutation,
  useRejectedOrderMutation,
  useCanceledOrderMutation,
} = ordersApi;
