import { configureStore } from "@reduxjs/toolkit";

import {
  persistStore,
  persistReducer,
} from "redux-persist";

import storageModule from "redux-persist/lib/storage";

import { setupListeners } from "@reduxjs/toolkit/query";

import rootReducer from "./rootReducer";
import { baseApi } from "../services/baseApi";

const storage = storageModule.default;

const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "auth",
    "wishlist",
    "theme",
  ],
};

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: {
    root: persistedReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(baseApi.middleware),
});

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);

export const persistor =
  persistStore(store);