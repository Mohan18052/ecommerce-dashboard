import { useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import ProductCard from "../../components/ProductCard/ProductCard";
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

  const topRated = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 8),
    [products]
  );

  const avgRating = useMemo(() => {
    if (!products.length) return 0;
    return (products.reduce((sum, p) => sum + (p.rating || 0), 0) / products.length).toFixed(1);
  }, [products]);

  const categories = useMemo(
    () => new Set(products.map((p) => p.category)).size,
    [products]
  );

  const handleNavigate = useCallback((path) => navigate(path), [navigate]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="h-48 rounded-2xl skeleton-shimmer mb-8" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <Loader key={i} />)}
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error.friendlyMessage || "Something went wrong"}</p>
          <button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary-light text-white font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer">
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

        {/* ── Welcome Banner ── */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary-light to-blue-900 text-white shadow-xl border border-accent/20">
          {/* decorative glow */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Welcome back</p>
                <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">
                  {user?.name || "User"} <span className="inline-block">👋</span>
                </h1>
                <p className="text-sm text-gray-300">
                  Discover amazing deals on {products.length}+ premium products
                </p>
              </div>
              <button
                onClick={() => handleNavigate("/products")}
                className="flex-shrink-0 bg-accent hover:bg-accent-hover text-primary font-extrabold px-7 py-3.5 rounded-xl transition-all shadow-lg shadow-accent/30 cursor-pointer hover:-translate-y-0.5 active:scale-95"
              >
                Browse Products →
              </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-px mt-6 bg-white/10 rounded-xl overflow-hidden border border-white/10">
              {[
                { num: `${products.length}+`, label: "Products" },
                { num: categories, label: "Categories" },
                { num: wishlistItems.length, label: "Wishlist" },
                { num: cartCount, label: "Cart Items" },
                { num: `${avgRating}★`, label: "Avg Rating" },
              ].map(({ num, label }) => (
                <div key={label} className="flex flex-col items-center justify-center py-3 px-2 bg-white/5 hover:bg-white/10 transition-colors">
                  <span className="text-lg font-extrabold text-accent">{num}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Products ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">⭐ Featured Products</h2>
            <button onClick={() => handleNavigate("/products")} className="text-sm text-text-link dark:text-blue-400 hover:underline font-medium cursor-pointer">View all →</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {featuredProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>

        {/* ── Recently Viewed ── */}
        {recentlyViewed.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🕐 Recently Viewed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {recentlyViewed.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigate(`/products/${item.productId}`)}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <img src={item.image} alt={item.title} loading="lazy" className="w-full h-36 object-cover" />
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.brand}</p>
                    <StarRating rating={item.rating} reviews={item.reviews} showCount={false} />
                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">₹{item.price?.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Top Rated ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">🏆 Top Rated Products</h2>
            <button onClick={() => handleNavigate("/products")} className="text-sm text-text-link dark:text-blue-400 hover:underline font-medium cursor-pointer">View all →</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {topRated.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>

        {/* ── Wishlist Preview ── */}
        {wishlistItems.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">❤️ Your Wishlist</h2>
              <button onClick={() => handleNavigate("/wishlist")} className="text-sm text-text-link dark:text-blue-400 hover:underline font-medium cursor-pointer">View all ({wishlistItems.length}) →</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {wishlistItems.slice(0, 4).map((item) => (
                <div key={item.id} onClick={() => handleNavigate(`/products/${item.id}`)} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex gap-3 p-3">
                  <img src={item.image} alt={item.title} loading="lazy" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">₹{item.price?.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Cart Preview ── */}
        {cartItems.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">🛒 Your Cart</h2>
              <button onClick={() => handleNavigate("/cart")} className="text-sm text-text-link dark:text-blue-400 hover:underline font-medium cursor-pointer">View cart ({cartCount} items) →</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {cartItems.slice(0, 4).map((item) => (
                <div key={item.id} onClick={() => handleNavigate(`/products/${item.id}`)} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex gap-3 p-3">
                  <img src={item.image} alt={item.title} loading="lazy" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">₹{(item.price * item.quantity)?.toLocaleString("en-IN")}</p>
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
