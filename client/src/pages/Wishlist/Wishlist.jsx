import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import Pagination from "../../components/Pagination/Pagination";
import StarRating from "../../components/StarRating/StarRating";
import { addToCart } from "../../features/cart/cartSlice";
import {
  useGetWishlistQuery,
  useRemoveWishlistItemMutation,
} from "../../features/wishlist/wishlistApi";

function Wishlist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: wishlistItems = [], isLoading } = useGetWishlistQuery();
  const [removeWishlistItem] = useRemoveWishlistItemMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    document.title = `Wishlist (${wishlistItems.length}) — ShopZone`;
  }, [wishlistItems.length]);

  const totalPages = Math.ceil(wishlistItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return wishlistItems.slice(start, start + itemsPerPage);
  }, [wishlistItems, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleRemove = useCallback(
    (id) => removeWishlistItem(id),
    [removeWishlistItem]
  );

  const handleMoveToCart = useCallback(
    (item) => {
      dispatch(addToCart(item));
      removeWishlistItem(item.id);
    },
    [dispatch, removeWishlistItem]
  );

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-72 rounded-xl skeleton-shimmer" />
            ))}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Wishlist
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""} saved
            </p>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Save products you love to your wishlist
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {paginatedItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Image */}
                  <div
                    className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square cursor-pointer"
                    onClick={() => navigate(`/products/${item.id}`)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Remove button overlay */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.id);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-md cursor-pointer"
                      aria-label="Remove from wishlist"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {item.category}
                    </span>
                    <h3
                      className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => navigate(`/products/${item.id}`)}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      by <span className="font-medium">{item.brand || "Unknown"}</span>
                    </p>

                    {item.rating && (
                      <StarRating
                        rating={item.rating}
                        reviews={item.reviews || 0}
                      />
                    )}

                    <div className="flex items-baseline gap-1 pt-1">
                      <span className="text-xs text-gray-500">₹</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {item.price?.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {/* Move to Cart */}
                    <button
                      onClick={() => handleMoveToCart(item)}
                      className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 text-xs font-semibold py-2.5 rounded-lg transition-colors mt-2 cursor-pointer"
                    >
                      🛒 Move to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}
      </main>
    </>
  );
}

export default Wishlist;