import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../features/auth/authSlice";

// Custom base query with centralized error handling
const baseQueryWithErrorHandling = async (args, api, extraOptions) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:4000",
  });

  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status;

    // Handle 401 — redirect to login
    if (status === 401 || status === 403) {
      api.dispatch(logout());
      window.location.href = "/login";
    }

    // Enhance error with friendly messages
    const errorMessages = {
      400: "Bad request. Please check your input.",
      401: "Session expired. Please login again.",
      403: "You don't have permission to perform this action.",
      404: "The requested resource was not found.",
      500: "Server error. Please try again later.",
    };

    result.error.friendlyMessage =
      errorMessages[status] || "Something went wrong. Please try again.";
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithErrorHandling,

  tagTypes: [
    "Users",
    "Products",
    "Cart",
    "Wishlist",
    "RecentlyViewed",
  ],

  // Refetch on window focus and network reconnect
  refetchOnFocus: true,
  refetchOnReconnect: true,

  endpoints: () => ({}),
});