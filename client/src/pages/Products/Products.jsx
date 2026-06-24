import { useState, useMemo, useRef, useCallback, useEffect } from "react";

import Navbar from "../../components/Navbar/Navbar";
import ProductCard from "../../components/ProductCard/ProductCard";
import Loader from "../../components/Loader/Loader";
import VirtualizedList from "../../components/VirtualizedList/VirtualizedList";

import { useGetProductsQuery } from "../../features/products/productsApi";
import useDebounce from "../../hooks/useDebounce";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

function Products() {
  const {
    data = [],
    isLoading,
    error,
  } = useGetProductsQuery(undefined, {
    pollingInterval: 30000,
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [useVirtualized, setUseVirtualized] = useState(false);

  const loaderRef = useRef(null);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    document.title = "Products — ShopZone";
  }, []);

  // Reset visible count when filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [debouncedSearch, category, sort]);

  const filteredProducts = useMemo(() => {
    if (!data) return [];

    let products = [...data];

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      products = products.filter(
        (product) =>
          product.title.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    if (category !== "All") {
      products = products.filter(
        (product) => product.category === category
      );
    }

    if (sort === "low-high") {
      products.sort((a, b) => a.price - b.price);
    } else if (sort === "high-low") {
      products.sort((a, b) => b.price - a.price);
    } else if (sort === "rating") {
      products.sort((a, b) => b.rating - a.rating);
    } else if (sort === "reviews") {
      products.sort((a, b) => b.reviews - a.reviews);
    }

    return products;
  }, [data, debouncedSearch, category, sort]);

  const visibleProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  const loadMore = useCallback(() => {
    if (visibleCount < filteredProducts.length) {
      setVisibleCount((prev) => prev + 20);
    }
  }, [visibleCount, filteredProducts.length]);

  useInfiniteScroll(loaderRef, loadMore);

  const categories = useMemo(
    () => ["All", ...new Set(data?.map((p) => p.category))],
    [data]
  );

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setCategory(e.target.value);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSort(e.target.value);
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
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
            Error Loading Products
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Products
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredProducts.length} products found
            </p>
          </div>

          {/* Toggle Virtualized View */}
          <button
            onClick={() => setUseVirtualized(!useVirtualized)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              useVirtualized
                ? "bg-primary text-white border-primary"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            ⚡ {useVirtualized ? "Virtual View ON" : "Enable Virtual View"}
          </button>
        </div>

        {/* Filters Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by name, brand, or category..."
                value={search}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-sm"
              />
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={handleCategoryChange}
              className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={handleSortChange}
              className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-accent cursor-pointer"
            >
              <option value="">Sort By</option>
              <option value="low-high">Price: Low → High</option>
              <option value="high-low">Price: High → Low</option>
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>
        </div>

        {/* No Products */}
        {filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
              No Products Found
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Products Grid — Virtualized or Standard */}
        {filteredProducts.length > 0 && useVirtualized ? (
          <VirtualizedList
            items={filteredProducts}
            renderItem={(product) => (
              <ProductCard key={product.id} product={product} />
            )}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {visibleCount < filteredProducts.length && (
              <div
                ref={loaderRef}
                className="flex items-center justify-center py-8"
              >
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <span className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 border-t-primary rounded-full animate-spin" />
                  <span className="text-sm">Loading more products...</span>
                </div>
              </div>
            )}

            {visibleCount >= filteredProducts.length && filteredProducts.length > 0 && (
              <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-8">
                — You've seen all {filteredProducts.length} products —
              </p>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default Products;