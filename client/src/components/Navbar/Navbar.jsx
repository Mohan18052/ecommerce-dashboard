import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../../features/auth/authSlice";
import {
  toggleTheme,
} from "../../features/theme/themeSlice"; // Added themeSlice import

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartCount = useSelector(
    (state) => state.root.cart.items.length
  );

  // Added theme state selector
  const theme = useSelector(
    (state) => state.root.theme.mode
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "15px",
        padding: "15px",
        borderBottom: "1px solid #ccc",
        marginBottom: "20px",
      }}
    >
      <button onClick={() => navigate("/")}>
        Dashboard
      </button>

      <button onClick={() => navigate("/products")}>
        Products
      </button>

      <button onClick={() => navigate("/cart")}>
        Cart ({cartCount})
      </button>

      {/* Updated Wishlist Button */}
      <button onClick={() => navigate("/wishlist")}>
        Wishlist
      </button>

      {/* Updated Profile Button */}
      <button
        onClick={() =>
          navigate("/profile")
        }
      >
        Profile
      </button>

      {/* Added Toggle Theme Button */}
      <button
        onClick={() =>
          dispatch(toggleTheme())
        }
      >
        {theme === "light"
          ? "🌙 Dark"
          : "☀️ Light"}
      </button>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;