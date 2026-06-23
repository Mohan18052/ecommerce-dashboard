import Navbar from "../../components/Navbar/Navbar";

import {
  useGetWishlistQuery,
  useRemoveWishlistItemMutation,
} from "../../features/wishlist/wishlistApi";

function Wishlist() {
  const {
    data: wishlistItems = [],
    isLoading,
  } = useGetWishlistQuery();

  const [
    removeWishlistItem,
  ] =
    useRemoveWishlistItemMutation();

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      <Navbar />

      <h1>Wishlist Page</h1>

      {wishlistItems.length === 0 ? (
        <h2>Wishlist Empty</h2>
      ) : (
        wishlistItems.map((item) => (
          <div
            key={item.id}
            style={{
              border:
                "1px solid gray",
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

              <p>
                Category:
                {item.category}
              </p>

              <p>
                ₹ {item.price}
              </p>

              <button
                onClick={() =>
                  removeWishlistItem(
                    item.id
                  )
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

export default Wishlist;