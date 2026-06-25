import { configureStore } from "@reduxjs/toolkit";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  createMigrate,
} from "redux-persist";

import storageModule from "redux-persist/lib/storage";

import { setupListeners } from "@reduxjs/toolkit/query";

import rootReducer from "./rootReducer";
import { baseApi } from "../services/baseApi";

const storage = storageModule.default;

// Persist migration — version 0 -> 1
const migrations = {
  1: (state) => {
    return {
      ...state,
      cart: {
        items: state?.cart?.items || [],
        past: [],
        future: [],
      },
    };
  },
};

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: [
    "auth",
    "wishlist",
    "theme",
  ],
  migrate: createMigrate(migrations, { debug: false }),
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
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware),
});

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);

export const persistor =
  persistStore(store);

// Persist purge on logout
export const purgeOnLogout = () => {
  persistor.purge();
};