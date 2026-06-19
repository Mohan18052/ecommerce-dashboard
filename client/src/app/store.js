import { configureStore } from "@reduxjs/toolkit";

import rootReducer from "./rootReducer";
import { baseApi } from "../services/baseApi";

export const store = configureStore({
  reducer: {
    root: rootReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});