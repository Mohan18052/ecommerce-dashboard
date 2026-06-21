import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "280px",
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

export default ProductCard;