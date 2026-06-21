import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { addToWishlist } from "../../features/wishlist/wishlistSlice"; // Added Wishlist import
import { useGetProductByIdQuery } from "../../features/products/productsApi";
import Navbar from "../../components/Navbar/Navbar";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    data,
    isLoading,
    error,
  } = useGetProductByIdQuery(id);

  if (isLoading) {
    return <h1>Loading Product...</h1>;
  }

  if (error) {
    return <h1>Product Not Found</h1>;
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

        {/* Updated Add To Wishlist Button */}
        <button
          style={{
            marginLeft: "10px",
          }}
          onClick={() => dispatch(addToWishlist(data))}
        >
          Add To Wishlist
        </button>
      </div>
    </div>
  );
}

export default Product;