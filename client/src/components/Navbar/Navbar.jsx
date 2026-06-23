import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../../features/auth/authSlice";
import {
  toggleTheme,
} from "../../features/theme/themeSlice"; 
import useOnlineStatus from "../../hooks/useOnlineStatus"; // Added online status hook import

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

  // Added online status tracking hook
  const isOnline = useOnlineStatus();

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
        alignItems: "center", // Keeps the status text vertically aligned with the buttons
      }}
    >
      {/* Added Online/Offline Status Indicator */}
      <div>
        {isOnline ? (
          <span>
            🟢 Online
          </span>
        ) : (
          <span>
            🔴 Offline
          </span>
        )}
      </div>

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