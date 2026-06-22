import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import {
  removeFromCart,
  clearCart,
} from "../../features/cart/cartSlice";

function Cart() {
  const dispatch = useDispatch();

  const cartItems = useSelector(
    (state) => state.root.cart.items
  );

  return (
    <div>
      <Navbar />

      <h1>Cart Page</h1>

      <button
        onClick={() => dispatch(clearCart())}
      >
        Clear Cart
      </button>

      {cartItems.length === 0 ? (
        <h2>Cart Empty</h2>
      ) : (
        cartItems.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid gray",
              margin: "10px",
              padding: "10px",
              display: "flex",
              gap: "20px",
              alignItems: "center",
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />

            <div>
              <h3>{item.title}</h3>

              <p>Brand: {item.brand}</p>

              <p>Category: {item.category}</p>

              <p>₹ {item.price}</p>

              <p>
                Quantity: {item.quantity}
              </p>

              <button
                onClick={() =>
                  dispatch(removeFromCart(item.id))
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Cart;