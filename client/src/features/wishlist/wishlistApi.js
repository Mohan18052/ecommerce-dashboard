import { baseApi } from "../../services/baseApi";

export const wishlistApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      getWishlist: builder.query({
        query: () => "/wishlist",

        providesTags: ["Wishlist"],
      }),

      addWishlistItem:
        builder.mutation({
          query: (product) => ({
            url: "/wishlist",
            method: "POST",
            body: product,
          }),

          invalidatesTags: [
            "Wishlist",
          ],
        }),

      removeWishlistItem:
        builder.mutation({
          query: (id) => ({
            url: `/wishlist/${id}`,
            method: "DELETE",
          }),

          invalidatesTags: [
            "Wishlist",
          ],
        }),
    }),
  });

export const {
  useGetWishlistQuery,
  useAddWishlistItemMutation,
  useRemoveWishlistItemMutation,
} = wishlistApi;