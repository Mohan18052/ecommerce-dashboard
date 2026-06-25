import { useState, useMemo, useRef, useCallback, useEffect } from "react";

import Navbar from "../../components/Navbar/Navbar";
import ProductCard from "../../components/ProductCard/ProductCard";
import Loader from "../../components/Loader/Loader";
import VirtualizedList from "../../components/VirtualizedList/VirtualizedList";

import { useGetProductsQuery } from "../../features/products/productsApi";
import useDebounce from "../../hooks/useDebounce";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

function Products() {
  const { data = [], isLoading, error } = useGetProductsQuery(undefined, { pollingInterval: 30000 });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [appliedMin, setAppliedMin] = useState("");
  const [appliedMax, setAppliedMax] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [specialFilter, setSpecialFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [useVirtualized, setUseVirtualized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);

  const loaderRef = useRef(null);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => { document.title = "Products — ShopZone"; }, []);
  useEffect(() => { setVisibleCount(20); }, [debouncedSearch, category, sort, appliedMin, appliedMax, minRating, inStockOnly, specialFilter]);

  const categories = useMemo(() => ["All", ...new Set(data?.map((p) => p.category))], [data]);

  const hotDealsIds = useMemo(() => {
    if (!data.length) return new Set();
    const sorted = [...data].sort((a, b) => b.reviews - a.reviews);
    return new Set(sorted.slice(0, 30).map((p) => p.id));
  }, [data]);

  const filteredProducts = useMemo(() => {
    if (!data) return [];
    let products = [...data];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      products = products.filter(
        (p) => p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }
    if (category !== "All") products = products.filter((p) => p.category === category);
    if (specialFilter === "hot") products = products.filter((p) => hotDealsIds.has(p.id));
    else if (specialFilter === "featured") products = products.filter((p) => p.featured);
    else if (specialFilter === "new") products = products.slice(-40);
    if (appliedMin !== "") products = products.filter((p) => p.price >= Number(appliedMin));
    if (appliedMax !== "") products = products.filter((p) => p.price <= Number(appliedMax));
    if (minRating > 0) products = products.filter((p) => p.rating >= minRating);
    if (inStockOnly) products = products.filter((p) => p.stock > 0);
    if (sort === "low-high") products.sort((a, b) => a.price - b.price);
    else if (sort === "high-low") products.sort((a, b) => b.price - a.price);
    else if (sort === "rating") products.sort((a, b) => b.rating - a.rating);
    else if (sort === "reviews") products.sort((a, b) => b.reviews - a.reviews);
    return products;
  }, [data, debouncedSearch, category, sort, appliedMin, appliedMax, minRating, inStockOnly, specialFilter, hotDealsIds]);

  const visibleProducts = useMemo(() => filteredProducts.slice(0, visibleCount), [filteredProducts, visibleCount]);

  const loadMore = useCallback(() => {
    if (visibleCount < filteredProducts.length) setVisibleCount((prev) => prev + 20);
  }, [visibleCount, filteredProducts.length]);

  useInfiniteScroll(loaderRef, loadMore);

  const handleApplyPrice = useCallback(() => {
    setAppliedMin(minPrice);
    setAppliedMax(maxPrice);
  }, [minPrice, maxPrice]);

  const handleClearAll = useCallback(() => {
    setSearch(""); setCategory("All"); setSort("");
    setMinPrice(""); setMaxPrice(""); setAppliedMin(""); setAppliedMax("");
    setMinRating(0); setInStockOnly(false); setSpecialFilter("");
  }, []);

  const hasActiveFilters = category !== "All" || sort !== "" || appliedMin !== "" || appliedMax !== "" || minRating > 0 || inStockOnly || specialFilter !== "";

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => <Loader key={i} />)}
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Products</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error.friendlyMessage || "Something went wrong"}</p>
          <button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary-light text-white font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer">🔄 Retry</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* ── Top bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">

          {/* ── Search bar (improved) ── */}
          <div className="flex-1 relative group">
            {/* Glowing border ring on focus */}
            <div className={`absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none ${
              searchFocused
                ? "ring-2 ring-accent/60 ring-offset-1 ring-offset-transparent"
                : "ring-0"
            }`} />

            {/* Search icon */}
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none ${
              searchFocused ? "text-accent" : "text-gray-400 dark:text-gray-500"
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Search by name, brand, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm shadow-sm transition-all duration-200 focus:border-accent focus:shadow-md"
            />

            {/* Clear button */}
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-500 dark:text-gray-300 transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border transition-all cursor-pointer ${
                sidebarOpen
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50"
              }`}
            >
              ☰ Filters {hasActiveFilters && <span className="bg-accent text-primary text-[10px] font-black px-1.5 py-0.5 rounded-full">ON</span>}
            </button>

            {/* Virtual view toggle */}
            <button
              onClick={() => setUseVirtualized(!useVirtualized)}
              className={`text-xs font-medium px-3 py-2.5 rounded-xl border transition-colors cursor-pointer ${
                useVirtualized ? "bg-primary text-white border-primary" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50"
              }`}
            >
              ⚡ {useVirtualized ? "Virtual ON" : "Virtual View"}
            </button>
          </div>
        </div>

        <div className="flex gap-6">

          {/* ── Sidebar ── */}
          {sidebarOpen && (
            <aside className="w-56 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-3 border-b-2 border-accent bg-gray-50 dark:bg-gray-900">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">🔍 Filters</span>
                  {hasActiveFilters && (
                    <button onClick={handleClearAll} className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer">Clear All</button>
                  )}
                </div>
                <div className="p-4 space-y-6">
                  <FilterSection title="Special">
                    {[
                      { val: "hot", label: "🔥 Hot Deals", count: 30 },
                      { val: "featured", label: "⭐ Featured", count: data.filter((p) => p.featured).length },
                      { val: "new", label: "🆕 New Arrivals", count: 40 },
                    ].map(({ val, label, count }) => (
                      <FilterOption key={val} label={label} count={count} active={specialFilter === val} onClick={() => setSpecialFilter((v) => (v === val ? "" : val))} />
                    ))}
                  </FilterSection>
                  <FilterSection title="Category">
                    {categories.map((cat) => (
                      <FilterOption key={cat} label={cat === "All" ? "All Categories" : cat} active={category === cat} onClick={() => setCategory(cat)} />
                    ))}
                  </FilterSection>
                  <FilterSection title="Sort By">
                    {[
                      { val: "", label: "Relevance" },
                      { val: "low-high", label: "Price: Low → High" },
                      { val: "high-low", label: "Price: High → Low" },
                      { val: "rating", label: "Top Rated" },
                      { val: "reviews", label: "Most Reviewed" },
                    ].map(({ val, label }) => (
                      <FilterOption key={val} label={label} active={sort === val} onClick={() => setSort(val)} />
                    ))}
                  </FilterSection>
                  <FilterSection title="Price Range (₹)">
                    <div className="flex gap-2">
                      <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-accent" />
                      <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-accent" />
                    </div>
                    <button onClick={handleApplyPrice} className="w-full mt-2 py-1.5 bg-accent hover:bg-accent-hover text-primary text-xs font-bold rounded-lg transition-colors cursor-pointer">Apply Price Filter</button>
                    {(appliedMin || appliedMax) && (
                      <p className="text-[10px] text-accent font-semibold mt-1 text-center">Active: ₹{appliedMin || "0"} – ₹{appliedMax || "∞"}</p>
                    )}
                  </FilterSection>
                  <FilterSection title="Min Rating">
                    {[4.5, 4.0, 3.0].map((r) => (
                      <FilterOption key={r} label={`${"★".repeat(Math.floor(r))} ${r}+`} active={minRating === r} onClick={() => setMinRating((v) => (v === r ? 0 : r))} />
                    ))}
                  </FilterSection>
                  <FilterSection title="Availability">
                    <FilterOption label="In Stock Only" active={inStockOnly} onClick={() => setInStockOnly((v) => !v)} />
                    <FilterOption label="All Products" active={!inStockOnly} onClick={() => setInStockOnly(false)} />
                  </FilterSection>
                </div>
              </div>
            </aside>
          )}

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Products</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{filteredProducts.length} products found</p>
              </div>
            </div>

            {filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Products Found</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Try adjusting your filters</p>
                <button onClick={handleClearAll} className="bg-accent text-primary font-bold px-5 py-2 rounded-xl text-sm cursor-pointer">Clear All Filters</button>
              </div>
            )}

            {filteredProducts.length > 0 && useVirtualized ? (
              <VirtualizedList items={filteredProducts} renderItem={(product) => <ProductCard key={product.id} product={product} />} />
            ) : (
              <>
                <div className={`grid gap-4 ${sidebarOpen ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"}`}>
                  {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                </div>
                {visibleCount < filteredProducts.length && (
                  <div ref={loaderRef} className="flex items-center justify-center py-8">
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
          </div>
        </div>
      </div>
    </>
  );
}

function FilterSection({ title, children }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2.5 pb-1 border-b border-gray-100 dark:border-gray-700">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function FilterOption({ label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
        active
          ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 font-semibold"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      }`}
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${active ? "bg-accent" : "bg-gray-300 dark:bg-gray-600"}`} />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-[10px] text-gray-400 dark:text-gray-500">{count}</span>}
    </button>
  );
}

export default Products;
