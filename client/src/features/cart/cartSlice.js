import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  past: [],
  future: [],
};

const MAX_HISTORY = 20;

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart: (state, action) => {
      // Save current state for undo
      state.past.push([...state.items]);
      if (state.past.length > MAX_HISTORY) state.past.shift();
      state.future = [];

      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    removeFromCart: (state, action) => {
      state.past.push([...state.items]);
      if (state.past.length > MAX_HISTORY) state.past.shift();
      state.future = [];

      state.items = state.items.filter(
        (item) => item.id !== action.payload
      );
    },

    incrementQuantity: (state, action) => {
      state.past.push(state.items.map((i) => ({ ...i })));
      if (state.past.length > MAX_HISTORY) state.past.shift();
      state.future = [];

      const item = state.items.find(
        (item) => item.id === action.payload
      );
      if (item) {
        item.quantity += 1;
      }
    },

    decrementQuantity: (state, action) => {
      state.past.push(state.items.map((i) => ({ ...i })));
      if (state.past.length > MAX_HISTORY) state.past.shift();
      state.future = [];

      const item = state.items.find(
        (item) => item.id === action.payload
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      } else if (item && item.quantity === 1) {
        state.items = state.items.filter(
          (i) => i.id !== action.payload
        );
      }
    },

    clearCart: (state) => {
      state.past.push([...state.items]);
      if (state.past.length > MAX_HISTORY) state.past.shift();
      state.future = [];

      state.items = [];
    },

    undoCart: (state) => {
      if (state.past.length === 0) return;
      const previous = state.past.pop();
      state.future.push([...state.items]);
      state.items = previous;
    },

    redoCart: (state) => {
      if (state.future.length === 0) return;
      const next = state.future.pop();
      state.past.push([...state.items]);
      state.items = next;
    },
  },
});

// Memoized selectors
export const selectCartItems = (state) => state.root.cart.items;

export const selectCartCount = (state) =>
  state.root.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartTotal = (state) =>
  state.root.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

export const selectCanUndo = (state) => state.root.cart.past.length > 0;
export const selectCanRedo = (state) => state.root.cart.future.length > 0;

export const {
  addToCart,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  undoCart,
  redoCart,
} = cartSlice.actions;

export default cartSlice.reducer;