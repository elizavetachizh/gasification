import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@/src/lib/features/baseQueryWithReauth";

export interface ConstructionObject {
  id: number;
  counterparty: number;
  applicant: string;
  guid: string;
  code: string;
}

export const constructionObjectsApi = createApi({
  reducerPath: "constructionObjectsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["constructionObjects"],
  endpoints: (builder) => ({
    getConstructionObjects: builder.query<ConstructionObject[], string | void>({
      query: () => ({
        url: "/erp/construction-objects",
      }),
      providesTags: ["constructionObjects"],
    }),
    createConstructionObject: builder.mutation<
      ConstructionObject,
      Partial<ConstructionObject>
    >({
      query: (newOrder) => ({
        url: "/erp/construction-objects/",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: ["constructionObjects"],
    }),
    updateConstructionObject: builder.mutation<
      ConstructionObject,
      { id: number; updatedOrder: Partial<ConstructionObject> }
    >({
      query: ({ id, updatedOrder }) => ({
        url: `/erp/construction-objects/${id}`,
        method: "POST",
        body: updatedOrder,
      }),
      invalidatesTags: ["constructionObjects"],
    }),
  }),
});

export const {
  useGetConstructionObjectsQuery,
  useCreateConstructionObjectMutation,
  useUpdateConstructionObjectMutation,
} = constructionObjectsApi;
