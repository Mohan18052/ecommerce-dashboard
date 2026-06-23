import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Added useDispatch import
import { productsApi } from "../../features/products/productsApi"; // Added productsApi import

function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Added dispatch hook initialization

  // Added handlePrefetch logic to cache product details on mouse enter
  const handlePrefetch = () => {
    dispatch(
      productsApi.util.prefetch(
        "getProductById",
        product.id,
        {
          force: false,
        }
      )
    );
  };

  return (
    <div
      onMouseEnter={handlePrefetch} // Attached mouse enter prefetch trigger
      style={{
        width: "270px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        margin: "10px",
      }}
    >
      <img
        src={product.image}
        alt={product.title}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
        }}
      />

      <h3>{product.title}</h3>

      <p>{product.description}</p>

      <h4>₹ {product.price}</h4>

      <p>{product.category}</p>

      <button
        onClick={() =>
          navigate(`/products/${product.id}`)
        }
      >
        View Details
      </button>
    </div>
  );
}

export default memo(ProductCard);