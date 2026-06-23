import { useEffect } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { useAddWishlistItemMutation } from "../../features/wishlist/wishlistApi"; // Added wishlistApi mutation import instead of slice
import { useLazyGetProductByIdQuery } from "../../features/products/productsApi"; 
import Navbar from "../../components/Navbar/Navbar";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Added wishlist api mutation trigger hook
  const [
    addWishlistItem,
  ] = useAddWishlistItemMutation();

  const [
    getProduct,
    {
      data,
      isLoading,
      error,
    },
  ] = useLazyGetProductByIdQuery();

  useEffect(() => {
    if (id) {
      getProduct(id);
    }
  }, [id, getProduct]);

  if (isLoading) {
    return <h1>Loading Product...</h1>;
  }

  if (error) {
    return <h1>Product Not Found</h1>;
  }

  if (!data) {
    return null;
  }

  return (
    <div>
      <Navbar />

      <div
        style={{
          padding: "20px",
        }}
      >
        <button
          onClick={() => navigate("/products")}
        >
          Back To Products
        </button>

        <br />
        <br />

        <img
          src={data.image}
          alt={data.title}
          style={{
            width: "350px",
            height: "350px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />

        <h1>{data.title}</h1>

        <h2>₹ {data.price}</h2>

        <p>{data.description}</p>

        <p>
          <strong>Category:</strong>{" "}
          {data.category}
        </p>

        <p>
          <strong>Stock:</strong>{" "}
          {data.stock}
        </p>

        {/* Add To Cart Button */}
        <button
          onClick={() => dispatch(addToCart(data))}
        >
          Add To Cart
        </button>

        {/* Updated Add To Wishlist Button to trigger API mutation handler directly */}
        <button
          style={{
            marginLeft: "10px",
          }}
          onClick={() => addWishlistItem(data)}
        >
          Add To Wishlist
        </button>
      </div>
    </div>
  );
}

export default Product;