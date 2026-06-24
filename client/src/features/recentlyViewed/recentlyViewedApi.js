import { baseApi } from "../../services/baseApi";

export const recentlyViewedApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecentlyViewed: builder.query({
      query: () => "/recentlyViewed",

      providesTags: ["RecentlyViewed"],

      transformResponse: (response) => {
        // Return last 10 items, most recent first
        return response.slice(-10).reverse();
      },

      keepUnusedDataFor: 300,
    }),

    addRecentlyViewed: builder.mutation({
      query: (product) => ({
        url: "/recentlyViewed",
        method: "POST",
        body: {
          productId: product.id,
          title: product.title,
          brand: product.brand,
          category: product.category,
          price: product.price,
          rating: product.rating,
          reviews: product.reviews,
          image: product.image,
          viewedAt: new Date().toISOString(),
        },
      }),

      // Optimistic update — immediately show in recently viewed
      async onQueryStarted(product, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          recentlyViewedApi.util.updateQueryData(
            "getRecentlyViewed",
            undefined,
            (draft) => {
              // Remove duplicate if exists
              const existingIndex = draft.findIndex(
                (item) => item.productId === product.id
              );
              if (existingIndex !== -1) {
                draft.splice(existingIndex, 1);
              }
              // Add to front (most recent)
              draft.unshift({
                productId: product.id,
                title: product.title,
                brand: product.brand,
                category: product.category,
                price: product.price,
                rating: product.rating,
                reviews: product.reviews,
                image: product.image,
                viewedAt: new Date().toISOString(),
              });
              // Keep only 10
              if (draft.length > 10) {
                draft.length = 10;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetRecentlyViewedQuery,
  useAddRecentlyViewedMutation,
} = recentlyViewedApi;
