import { baseApi } from "../../services/baseApi";

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Products", id })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],

      transformResponse: (response) => {
        // Ensure all products have required fields with defaults
        return response.map((product) => ({
          id: product.id,
          title: product.title || "Untitled Product",
          brand: product.brand || "Unknown",
          category: product.category || "General",
          price: product.price || 0,
          stock: product.stock ?? 0,
          rating: product.rating ?? 0,
          reviews: product.reviews ?? 0,
          featured: product.featured ?? false,
          description: product.description || "",
          image: product.image || "",
        }));
      },

      transformErrorResponse: (response) => {
        return {
          status: response.status,
          message: response.data?.error || "Failed to load products",
        };
      },

      // serializeQueryArgs — normalize cache key
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },

      // merge — merge new data into existing cache
      merge: (currentCache, newItems) => {
        return newItems;
      },

      // forceRefetch — refetch if data older than 120s
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg !== previousArg;
      },

      keepUnusedDataFor: 120,
    }),

    getProductById: builder.query({
      query: (id) => `/products/${id}`,

      providesTags: (result, error, id) => [
        { type: "Products", id },
      ],

      transformResponse: (response) => ({
        ...response,
        rating: response.rating ?? 0,
        reviews: response.reviews ?? 0,
        featured: response.featured ?? false,
        stock: response.stock ?? 0,
        brand: response.brand || "Unknown",
      }),

      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useLazyGetProductByIdQuery,
  useLazyGetProductsQuery,
} = productsApi;

// selectFromResult example: select only featured products
export const useGetFeaturedProducts = () =>
  useGetProductsQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => ({
      ...rest,
      featuredProducts: data?.filter((p) => p.featured) ?? [],
    }),
  });