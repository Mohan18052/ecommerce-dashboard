import { useSelector, useDispatch } from "react-redux";

import Navbar from "../../components/Navbar/Navbar";

import {
  removeFromWishlist,
  clearWishlist,
} from "../../features/wishlist/wishlistSlice";

function Wishlist() {
  const dispatch = useDispatch();

  const wishlistItems = useSelector(
    (state) => state.root.wishlist.items
  );

  return (
    <div>
      <Navbar />

      <h1>Wishlist Page</h1>

      <button
        onClick={() => dispatch(clearWishlist())}
      >
        Clear Wishlist
      </button>

      {wishlistItems.length === 0 ? (
        <h2>Wishlist Empty</h2>
      ) : (
        wishlistItems.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid gray",
              margin: "10px",
              padding: "10px",
            }}
          >
            <h3>{item.title}</h3>

            <p>₹ {item.price}</p>

            <button
              onClick={() =>
                dispatch(
                  removeFromWishlist(item.id)
                )
              }
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Wishlist;