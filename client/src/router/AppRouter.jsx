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

function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <h1>
            Loading Page...
          </h1>
        }
      >
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

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;