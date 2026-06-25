import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    addToWishlist: (state, action) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (!existingItem) {
        state.items.push(action.payload);
      }
    },

    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    clearWishlist: (state) => {
      state.items = [];
    },

    reorderWishlist: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const items = [...state.items];
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      state.items = items;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  reorderWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;