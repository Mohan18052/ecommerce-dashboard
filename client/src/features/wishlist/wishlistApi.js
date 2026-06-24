import { baseApi } from "../../services/baseApi";

export const wishlistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => "/wishlist",

      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Wishlist", id })),
              { type: "Wishlist", id: "LIST" },
            ]
          : [{ type: "Wishlist", id: "LIST" }],

      keepUnusedDataFor: 120,
    }),

    addWishlistItem: builder.mutation({
      query: (product) => ({
        url: "/wishlist",
        method: "POST",
        body: product,
      }),

      // Pessimistic update — update cache after server confirms
      async onQueryStarted(product, { dispatch, queryFulfilled }) {
        try {
          const { data: newItem } = await queryFulfilled;
          dispatch(
            wishlistApi.util.updateQueryData(
              "getWishlist",
              undefined,
              (draft) => {
                // Prevent duplicates
                const exists = draft.find((item) => item.id === newItem.id);
                if (!exists) {
                  draft.push(newItem);
                }
              }
            )
          );
        } catch {
          // If mutation fails, cache stays unchanged (pessimistic)
        }
      },
    }),

    removeWishlistItem: builder.mutation({
      query: (id) => ({
        url: `/wishlist/${id}`,
        method: "DELETE",
      }),

      // Optimistic update — remove from cache immediately
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          wishlistApi.util.updateQueryData(
            "getWishlist",
            undefined,
            (draft) => {
              const index = draft.findIndex((item) => item.id === id);
              if (index !== -1) {
                draft.splice(index, 1);
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          // If server fails, undo the optimistic update
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddWishlistItemMutation,
  useRemoveWishlistItemMutation,
} = wishlistApi;

// selectFromResult: get only wishlist count
export const useGetWishlistCount = () =>
  useGetWishlistQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => ({
      ...rest,
      wishlistCount: data?.length ?? 0,
    }),
  });