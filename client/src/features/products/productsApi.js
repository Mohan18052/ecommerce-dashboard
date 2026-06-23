import { baseApi } from "../../services/baseApi";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
getProducts: builder.query({
  query: () => "/products",

  providesTags: ["Products"],

  transformResponse: (response) => {
    return response;
  },

  transformErrorResponse: (
    response
  ) => {
    return response.status;
  },

  keepUnusedDataFor: 60,

  refetchOnFocus: true,

  refetchOnReconnect: true,
}),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,

      providesTags: (result, error, id) => [
        {
          type: "Products",
          id,
        },
      ],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,

  useLazyGetProductByIdQuery,
} = productsApi;