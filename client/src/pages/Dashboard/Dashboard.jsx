import { useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import ProductCard from "../../components/ProductCard/ProductCard";
import StatCard from "../../components/StatCard/StatCard";
import Loader from "../../components/Loader/Loader";
import StarRating from "../../components/StarRating/StarRating";

import { useGetProductsQuery } from "../../features/products/productsApi";
import { useGetRecentlyViewedQuery } from "../../features/recentlyViewed/recentlyViewedApi";
import { useGetWishlistQuery } from "../../features/wishlist/wishlistApi";
import { selectCartItems, selectCartCount } from "../../features/cart/cartSlice";

function Dashboard() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.root.auth.user);
  const cartItems = useSelector(selectCartItems);
  const cartCount = useSelector(selectCartCount);

  const { data: products = [], isLoading, error } = useGetProductsQuery();
  const { data: recentlyViewed = [] } = useGetRecentlyViewedQuery();
  const { data: wishlistItems = [] } = useGetWishlistQuery();

  useEffect(() => {
    document.title = "Dashboard — ShopZone";
  }, []);

  const featuredProducts = useMemo(
    () => products.filter((p) => p.featured).slice(0, 8),
    [products]
  );

  const handleNavigate = useCallback(
    (path) => navigate(path),
    [navigate]
  );

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl skeleton-shimmer" />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Loader key={i} />
            ))}
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
          <div className="text-5xl mb-4">😞</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {error.friendlyMessage || "Something went wrong"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary-light text-white font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            🔄 Retry
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-primary via-primary-light to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-300 mb-1">Welcome back,</p>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {user?.name || "User"} 👋
              </h1>
              <p className="text-sm text-gray-300 mt-2">
                Discover amazing deals on 350+ premium products
              </p>
            </div>
            <button
              onClick={() => handleNavigate("/products")}
              className="hidden sm:block bg-accent hover:bg-accent-hover text-primary font-bold px-6 py-3 rounded-xl transition-colors shadow-md cursor-pointer"
            >
              Browse Products →
            </button>
          </div>
        </section>

        {/* Statistics Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon="📦"
            label="Total Products"
            value={products.length}
            gradient="bg-gradient-to-br from-blue-500 to-blue-700"
          />
          <StatCard
            icon="🛒"
            label="Cart Items"
            value={cartCount}
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-700"
          />
          <StatCard
            icon="❤️"
            label="Wishlist Items"
            value={wishlistItems.length}
            gradient="bg-gradient-to-br from-rose-500 to-rose-700"
          />
          <StatCard
            icon="⭐"
            label="Featured"
            value={featuredProducts.length}
            gradient="bg-gradient-to-br from-amber-500 to-amber-700"
          />
        </section>

        {/* Featured Products */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              ⭐ Featured Products
            </h2>
            <button
              onClick={() => handleNavigate("/products")}
              className="text-sm text-text-link dark:text-blue-400 hover:underline font-medium cursor-pointer"
            >
              View all →
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              🕐 Recently Viewed
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
              {recentlyViewed.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigate(`/products/${item.productId}`)}
                  className="flex-shrink-0 w-48 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.brand}</p>
                    <StarRating rating={item.rating} reviews={item.reviews} showCount={false} />
                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                      ₹{item.price?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Wishlist Preview */}
        {wishlistItems.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                ❤️ Your Wishlist
              </h2>
              <button
                onClick={() => handleNavigate("/wishlist")}
                className="text-sm text-text-link dark:text-blue-400 hover:underline font-medium cursor-pointer"
              >
                View all ({wishlistItems.length}) →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigate(`/products/${item.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex gap-3 p-3"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                      ₹{item.price?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cart Preview */}
        {cartItems.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                🛒 Your Cart
              </h2>
              <button
                onClick={() => handleNavigate("/cart")}
                className="text-sm text-text-link dark:text-blue-400 hover:underline font-medium cursor-pointer"
              >
                View cart ({cartCount} items) →
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cartItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigate(`/products/${item.id}`)}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex gap-3 p-3"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                      ₹{(item.price * item.quantity)?.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default Dashboard;