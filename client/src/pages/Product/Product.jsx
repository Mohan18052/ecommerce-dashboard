import { useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { useAddWishlistItemMutation } from "../../features/wishlist/wishlistApi";
import { useLazyGetProductByIdQuery } from "../../features/products/productsApi";
import { useAddRecentlyViewedMutation } from "../../features/recentlyViewed/recentlyViewedApi";
import Navbar from "../../components/Navbar/Navbar";
import StarRating from "../../components/StarRating/StarRating";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addWishlistItem] = useAddWishlistItemMutation();
  const [addRecentlyViewed] = useAddRecentlyViewedMutation();

  const [getProduct, { data, isLoading, error }] =
    useLazyGetProductByIdQuery();

  useEffect(() => {
    if (id) {
      getProduct(id);
    }
  }, [id, getProduct]);

  // Track recently viewed
  useEffect(() => {
    if (data) {
      addRecentlyViewed(data);
      document.title = `${data.title} — ShopZone`;
    }
  }, [data, addRecentlyViewed]);

  const handleAddToCart = useCallback(() => {
    dispatch(addToCart(data));
  }, [dispatch, data]);

  const handleAddToWishlist = useCallback(() => {
    addWishlistItem(data);
  }, [addWishlistItem, data]);

  const handleGoBack = useCallback(() => {
    navigate("/products");
  }, [navigate]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square rounded-2xl skeleton-shimmer" />
            <div className="space-y-4">
              <div className="h-4 w-20 rounded skeleton-shimmer" />
              <div className="h-8 w-3/4 rounded skeleton-shimmer" />
              <div className="h-4 w-32 rounded skeleton-shimmer" />
              <div className="h-4 w-40 rounded skeleton-shimmer" />
              <div className="h-10 w-36 rounded skeleton-shimmer mt-4" />
              <div className="h-16 w-full rounded skeleton-shimmer mt-4" />
              <div className="flex gap-3 mt-6">
                <div className="h-12 flex-1 rounded-lg skeleton-shimmer" />
                <div className="h-12 flex-1 rounded-lg skeleton-shimmer" />
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={handleGoBack}
            className="bg-primary hover:bg-primary-light text-white font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            ← Back to Products
          </button>
        </div>
      </>
    );
  }

  if (!data) return null;

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <button
            onClick={() => navigate("/")}
            className="hover:text-text-link dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={handleGoBack}
            className="hover:text-text-link dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            Products
          </button>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium truncate">
            {data.title}
          </span>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="relative">
              <img
                src={data.image}
                alt={data.title}
                loading="lazy"
                className="w-full aspect-square object-cover"
              />
              {data.featured && (
                <span className="absolute top-4 left-4 bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            {/* Category */}
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              {data.category}
            </span>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {data.title}
            </h1>

            {/* Brand */}
            <p className="text-sm text-gray-500 dark:text-gray-400">
              by{" "}
              <span className="text-text-link dark:text-blue-400 font-semibold">
                {data.brand}
              </span>
            </p>

            {/* Rating */}
            <StarRating
              rating={data.rating}
              reviews={data.reviews}
            />

            {/* Price */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-gray-500">₹</span>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {data.price?.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Inclusive of all taxes
              </p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              {data.stock > 10 ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium text-success">
                    In Stock ({data.stock} available)
                  </span>
                </>
              ) : data.stock > 0 ? (
                <>
                  <span className="w-2 h-2 bg-amber-500 rounded-full" />
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    Only {data.stock} left — Order soon!
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm font-medium text-red-500">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                About this product
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {data.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={data.stock === 0}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3 rounded-xl transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className="flex-1 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-3 rounded-xl border border-gray-300 dark:border-gray-600 transition-colors text-sm cursor-pointer"
              >
                ❤️ Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Product;