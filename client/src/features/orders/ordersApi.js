import { baseApi } from "../../services/baseApi";

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrdersByUserId: builder.query({
      query: (userId) => `/orders?userId=${userId}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Orders", id })), { type: "Orders", id: "LIST" }]
          : [{ type: "Orders", id: "LIST" }],
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: "/orders",
        method: "POST",
        body: order,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),
  }),
});

export const { useGetOrdersByUserIdQuery, useCreateOrderMutation } = ordersApi;
