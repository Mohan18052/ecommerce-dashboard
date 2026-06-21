import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logout } from "../../features/auth/authSlice";

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartCount = useSelector(
    (state) => state.root.cart.items.length
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

      <button>
        Profile
      </button>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;