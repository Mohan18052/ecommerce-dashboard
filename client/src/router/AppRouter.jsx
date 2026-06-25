import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {
  lazy,
  Suspense,
} from "react";

import ProtectedRoute from "./ProtectedRoute";

const Login = lazy(() =>
  import("../pages/Login/Login")
);

const Register = lazy(() =>
  import("../pages/Register/Register")
);

const Dashboard = lazy(() =>
  import("../pages/Dashboard/Dashboard")
);

const Products = lazy(() =>
  import("../pages/Products/Products")
);

const Product = lazy(() =>
  import("../pages/Product/Product")
);

const Cart = lazy(() =>
  import("../pages/Cart/Cart")
);

const Wishlist = lazy(() =>
  import("../pages/Wishlist/Wishlist")
);

const Profile = lazy(() =>
  import("../pages/Profile/Profile")
);

const Checkout = lazy(() =>
  import("../pages/Checkout/Checkout")
);

const OrderSuccess = lazy(() =>
  import("../pages/OrderSuccess/OrderSuccess")
);

const ForgotPassword = lazy(() => import("../pages/ForgotPassword/ForgotPassword"));
const ResetPassword  = lazy(() => import("../pages/ResetPassword/ResetPassword"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-gray-300 dark:border-gray-600 border-t-amber-400 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
      </div>
    </div>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password"  element={<ResetPassword />} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;