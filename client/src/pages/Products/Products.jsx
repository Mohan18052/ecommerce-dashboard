import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import ProductCard from "../../components/ProductCard/ProductCard";
import Loader from "../../components/Loader/Loader";
import VirtualizedList from "../../components/VirtualizedList/VirtualizedList";

import { useGetProductsQuery } from "../../features/products/productsApi";
import useDebounce from "../../hooks/useDebounce";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

const globalBrokenImages = new Set();

function Products() {
  const { data = [], isLoading, error } = useGetProductsQuery(undefined, { pollingInterval: 30000 });
  const [brokenImages, setBrokenImages] = useState(globalBrokenImages);

  const handleImageError = useCallback((id) => {
    if (!globalBrokenImages.has(id)) {
      globalBrokenImages.add(id);
      setBrokenImages(new Set(globalBrokenImages));
    }
  }, []);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
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

  const loaderRef = useRef(null);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => { document.title = "Products — ShopZone"; }, []);
  useEffect(() => { setVisibleCount(20); }, [debouncedSearch, category, sort, appliedMin, appliedMax, minRating, inStockOnly, specialFilter]);

  const categories = useMemo(() => ["All", ...new Set(data?.map((p) => p.category))], [data]);

  useEffect(() => {
    if (categoryParam && data.length > 0) {
      const normalizedParam = categoryParam.toLowerCase();
      const matchedCategory = categories.find(
        (c) => c.toLowerCase() === normalizedParam
      );
      if (matchedCategory) {
        setCategory(matchedCategory);
      }
    }
  }, [categoryParam, categories, data]);

  const hotDealsIds = useMemo(() => {
    if (!data.length) return new Set();
    return new Set([...data].sort((a, b) => b.reviews - a.reviews).slice(0, 30).map((p) => p.id));
  }, [data]);

  const filteredProducts = useMemo(() => {
    if (!data) return [];
    let products = [...data];
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      products = products.filter((p) =>
        p.title.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
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

    // Push products with broken images to the end
    products.sort((a, b) => {
      const aBroken = brokenImages.has(a.id);
      const bBroken = brokenImages.has(b.id);
      if (aBroken && !bBroken) return 1;
      if (!aBroken && bBroken) return -1;
      return 0;
    });

    return products;
  }, [data, debouncedSearch, category, sort, appliedMin, appliedMax, minRating, inStockOnly, specialFilter, hotDealsIds, brokenImages]);

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
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(12)].map((_, i) => <Loader key={i} />)}
        </div>
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
          <button onClick={() => window.location.reload()} className="bg-primary text-white font-semibold px-6 py-2.5 rounded-lg cursor-pointer">🔄 Retry</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* ── Sticky search bar ── */}
      <div className="sticky top-14 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center gap-3 px-4 h-14">
          {/* Search */}
          <div className="flex-1 relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-8 h-9 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm outline-none focus:border-accent focus:bg-white dark:focus:bg-gray-700 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer text-xl leading-none">×</button>
            )}
          </div>
          {/* Filter btn */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className={`flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-bold border-2 transition-all cursor-pointer flex-shrink-0 ${
              sidebarOpen
                ? "bg-primary border-primary text-white"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-accent hover:text-accent"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
            </svg>
            Filters
            {hasActiveFilters && <span className="bg-accent text-primary text-[9px] font-black px-1.5 py-0.5 rounded-full">ON</span>}
          </button>
          {/* Virtual view */}
          <button
            onClick={() => setUseVirtualized(!useVirtualized)}
            className={`h-9 px-3 rounded-lg text-xs font-bold border-2 transition-all cursor-pointer flex-shrink-0 ${
              useVirtualized
                ? "bg-primary border-primary text-white"
                : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300"
            }`}
          >
            ⚡ {useVirtualized ? "Virtual ON" : "Virtual View"}
          </button>
        </div>
      </div>

      {/* ── Main layout — full width, no max-w ── */}
      <div className="flex min-h-screen">

        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-56 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="sticky top-28 max-h-[calc(100vh-7rem)] overflow-y-auto">

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b-2 border-accent bg-gray-50 dark:bg-gray-900">
                <span className="text-sm font-bold text-gray-900 dark:text-white">Filters</span>
                {hasActiveFilters && (
                  <button onClick={handleClearAll} className="text-xs text-red-500 font-semibold hover:underline cursor-pointer">Clear all</button>
                )}
              </div>

              <div className="p-3 space-y-1">

                <SidebarGroup title="Special Offers">
                  {[
                    { val: "hot", label: "Hot Deals", emoji: "🔥", count: 30 },
                    { val: "featured", label: "Featured", emoji: "⭐", count: data.filter((p) => p.featured).length },
                    { val: "new", label: "New Arrivals", emoji: "🆕", count: 40 },
                  ].map(({ val, label, emoji, count }) => (
                    <SidebarItem key={val} emoji={emoji} label={label} count={count}
                      active={specialFilter === val}
                      onClick={() => setSpecialFilter((v) => (v === val ? "" : val))}
                    />
                  ))}
                </SidebarGroup>

                <SidebarDivider />

                <SidebarGroup title="Category">
                  {categories.map((cat) => (
                    <SidebarItem key={cat} label={cat === "All" ? "All Categories" : cat}
                      active={category === cat} onClick={() => setCategory(cat)} />
                  ))}
                </SidebarGroup>

                <SidebarDivider />

                <SidebarGroup title="Sort By">
                  {[
                    { val: "", label: "Relevance" },
                    { val: "low-high", label: "Price: Low → High" },
                    { val: "high-low", label: "Price: High → Low" },
                    { val: "rating", label: "Top Rated" },
                    { val: "reviews", label: "Most Reviewed" },
                  ].map(({ val, label }) => (
                    <SidebarItem key={val} label={label} active={sort === val} onClick={() => setSort(val)} />
                  ))}
                </SidebarGroup>

                <SidebarDivider />

                <SidebarGroup title="Price Range (₹)">
                  <div className="flex gap-1.5 mt-1">
                    <input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-accent" />
                    <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:border-accent" />
                  </div>
                  <button onClick={handleApplyPrice}
                    className="w-full mt-2 py-1.5 bg-accent hover:bg-accent-hover text-primary text-xs font-bold rounded-lg cursor-pointer transition-colors">
                    Apply Filter
                  </button>
                  {(appliedMin || appliedMax) && (
                    <p className="text-[10px] text-amber-700 font-semibold mt-1.5 text-center bg-amber-50 dark:bg-amber-900/20 py-1 rounded-lg">
                      ₹{appliedMin || "0"} – ₹{appliedMax || "∞"}
                    </p>
                  )}
                </SidebarGroup>

                <SidebarDivider />

                <SidebarGroup title="Min Rating">
                  {[{ r: 4.5, label: "4.5+ ★★★★★" }, { r: 4.0, label: "4.0+ ★★★★" }, { r: 3.0, label: "3.0+ ★★★" }].map(({ r, label }) => (
                    <SidebarItem key={r} label={label} active={minRating === r}
                      onClick={() => setMinRating((v) => (v === r ? 0 : r))} />
                  ))}
                </SidebarGroup>

                <SidebarDivider />

                <SidebarGroup title="Availability">
                  <SidebarItem label="In Stock Only" active={inStockOnly} onClick={() => setInStockOnly(true)} />
                  <SidebarItem label="All Products" active={!inStockOnly} onClick={() => setInStockOnly(false)} />
                </SidebarGroup>

              </div>
            </div>
          </aside>
        )}

        {/* ── Products grid — takes ALL remaining width ── */}
        <div className="flex-1 min-w-0 p-5">
          <div className="mb-4">
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">Products</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filteredProducts.length} products found
              {hasActiveFilters && <span className="ml-1.5 text-amber-600 font-semibold">· Filters active</span>}
            </p>
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Products Found</h2>
              <p className="text-sm text-gray-500 mb-4">Try adjusting your filters</p>
              <button onClick={handleClearAll} className="bg-accent text-primary font-bold px-5 py-2 rounded-xl text-sm cursor-pointer">Clear Filters</button>
            </div>
          )}

          {filteredProducts.length > 0 && useVirtualized ? (
            <VirtualizedList items={filteredProducts} sidebarOpen={sidebarOpen} renderItem={(product) => <ProductCard key={product.id} product={product} onImageError={handleImageError} />} />
          ) : (
            <>
              {/* Grid fills full width — more columns when sidebar closed */}
              <div className={`grid gap-4 ${
                sidebarOpen
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              }`}>
                {visibleProducts.map((product) => <ProductCard key={product.id} product={product} onImageError={handleImageError} />)}
              </div>

              {/* Loading spinner */}
              {visibleCount < filteredProducts.length && (
                <div ref={loaderRef} className="flex justify-center py-8">
                  <div className="flex items-center gap-3 text-gray-500">
                    <span className="w-5 h-5 border-2 border-gray-300 border-t-accent rounded-full animate-spin" />
                    <span className="text-sm">Loading more...</span>
                  </div>
                </div>
              )}

              {/* End of results message */}
              {visibleCount >= filteredProducts.length && filteredProducts.length > 0 && (
                <p className="text-center text-sm text-gray-400 py-8 border-t border-gray-100 dark:border-gray-700 mt-4">
                  ✓ All {filteredProducts.length} products loaded
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function SidebarGroup({ title, children }) {
  return (
    <div className="py-2">
      <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5 px-1">{title}</p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function SidebarItem({ label, emoji, count, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer text-left ${
        active
          ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 font-semibold border border-amber-200 dark:border-amber-800/40"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent"
      }`}
    >
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${active ? "bg-accent" : "bg-gray-200 dark:bg-gray-600"}`} />
      {emoji && <span>{emoji}</span>}
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && (
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
          active ? "bg-amber-100 dark:bg-amber-800/40 text-amber-700 dark:text-amber-300" : "bg-gray-100 dark:bg-gray-700 text-gray-400"
        }`}>{count}</span>
      )}
    </button>
  );
}

function SidebarDivider() {
  return <div className="border-t border-gray-100 dark:border-gray-700 my-1" />;
}

export default Products;