import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import notificationReducer from "../features/notification/notificationSlice";
import themeReducer from "../features/theme/themeSlice";
import uiReducer from "../features/ui/uiSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  notification: notificationReducer,
  theme: themeReducer,
  ui: uiReducer,
});

export default rootReducer;