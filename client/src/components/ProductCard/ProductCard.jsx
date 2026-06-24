import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { productsApi } from "../../features/products/productsApi";
import { addToCart } from "../../features/cart/cartSlice";
import StarRating from "../StarRating/StarRating";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handlePrefetch = useCallback(() => {
    dispatch(
      productsApi.util.prefetch(
        "getProductById",
        product.id,
        { force: false }
      )
    );
  }, [dispatch, product.id]);

  const handleViewDetails = useCallback(() => {
    navigate(`/products/${product.id}`);
  }, [navigate, product.id]);

  const handleAddToCart = useCallback(
    (e) => {
      e.stopPropagation();
      dispatch(addToCart(product));
    },
    [dispatch, product]
  );

  return (
    <div
      onMouseEnter={handlePrefetch}
      className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
      onClick={handleViewDetails}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-accent text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Featured
          </span>
        )}
        {product.stock <= 10 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        {/* Category Badge */}
        <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          {product.category}
        </span>

        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {product.title}
        </h3>

        {/* Brand */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          by <span className="text-text-link dark:text-blue-400 font-medium">{product.brand}</span>
        </p>

        {/* Rating */}
        <StarRating rating={product.rating} reviews={product.reviews} />

        {/* Price */}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-gray-500">₹</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {product.price?.toLocaleString("en-IN")}
            </span>
          </div>
          {product.stock > 0 ? (
            <p className="text-xs text-success font-medium mt-0.5">In Stock</p>
          ) : (
            <p className="text-xs text-red-500 font-medium mt-0.5">Out of Stock</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 text-xs font-semibold py-2 px-3 rounded-lg transition-colors cursor-pointer"
          >
            Add to Cart
          </button>
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-semibold py-2 px-3 rounded-lg transition-colors cursor-pointer"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);