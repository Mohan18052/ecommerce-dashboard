import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { useAddWishlistItemMutation } from "../../features/wishlist/wishlistApi";
import StarRating from "../StarRating/StarRating";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addWishlistItem] = useAddWishlistItemMutation();

  const handleViewDetails = useCallback(() => {
    navigate(`/products/${product.id}`);
  }, [navigate, product.id]);

  const handleAddToCart = useCallback((e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
  }, [dispatch, product]);

  const handleAddToWishlist = useCallback((e) => {
    e.stopPropagation();
    addWishlistItem(product);
  }, [addWishlistItem, product]);

  return (
    <div
      onClick={handleViewDetails}
      className="group w-full bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-amber-100/40 dark:hover:shadow-amber-900/20 transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer"
    >
      {/* Product Image */}
      <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-square flex-shrink-0">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {product.featured && (
          <span className="absolute top-2 left-2 bg-gradient-to-r from-amber-400 to-amber-500 text-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
            Featured
          </span>
        )}

        {product.stock <= 10 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
            Only {product.stock} Left
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        <span className="text-[10px] uppercase font-semibold tracking-wide text-blue-600 dark:text-blue-400 truncate">
          {product.category}
        </span>

        <h3 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {product.title}
        </h3>

        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          by{" "}
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {product.brand}
          </span>
        </p>

        <StarRating rating={product.rating} reviews={product.reviews} />

        <div className="mt-auto pt-1">
          <div className="flex items-baseline gap-0.5">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">₹</span>
            <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              {product.price?.toLocaleString("en-IN")}
            </span>
          </div>

          {product.stock > 0 ? (
            <p className="text-green-600 text-xs font-medium">In Stock</p>
          ) : (
            <p className="text-red-500 text-xs font-medium">Out Of Stock</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-1.5 mt-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 min-w-0 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black text-[11px] font-bold py-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-amber-200 dark:hover:shadow-amber-900/40 active:scale-95 truncate"
          >
            🛒 Add to Cart
          </button>

          <button
            onClick={handleAddToWishlist}
            className="flex-1 min-w-0 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-[11px] font-semibold py-2 rounded-lg transition-colors truncate"
          >
            ❤️ Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
