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

  useEffect(() => { document.title = "Dashboard — ShopZone"; }, []);

  const featuredProducts = useMemo(() => products.filter((p) => p.featured).slice(0, 12), [products]);
  const topRated = useMemo(() => [...products].sort((a, b) => b.rating - a.rating).slice(0, 12), [products]);
  const hotDeals = useMemo(() => [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 12), [products]);
  const categoryCount = useMemo(() => new Set(products.map((p) => p.category)).size, [products]);

  const handleNavigate = useCallback((path) => navigate(path), [navigate]);

  const uniqueRecentlyViewed = useMemo(() => {
    const seen = new Set();
    return [...recentlyViewed].reverse().filter((item) => {
      if (seen.has(item.productId)) return false;
      seen.add(item.productId);
      return true;
    }).slice(0, 12);
  }, [recentlyViewed]);

  const categories = [
    { icon: "📱", name: "Mobiles",   cat: "mobile"   },
    { icon: "💻", name: "Laptops",   cat: "laptop"   },
    { icon: "🎧", name: "Audio",     cat: "audio"    },
    { icon: "🎮", name: "Gaming",    cat: "gaming"   },
    { icon: "⌚", name: "Wearables", cat: "wearable" },
  ];

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="w-full px-4 sm:px-6 py-6">
          <div className="h-80 rounded-2xl bg-gray-900 animate-pulse mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{error.friendlyMessage || "Something went wrong"}</p>
          <button onClick={() => window.location.reload()} className="bg-yellow-500 text-black font-semibold px-6 py-2.5 rounded-lg cursor-pointer">🔄 Retry</button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="w-full px-4 sm:px-6 py-6 space-y-10">

        {/* ── Cinematic Hero ── */}
        <section className="relative overflow-hidden rounded-2xl" style={{ background: "#0a0a0f", minHeight: "320px" }}>
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            {[...Array(50)].map((_, i) => (
              <span key={i} className="absolute rounded-full bg-white" style={{
                width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.6 + 0.1,
                animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite alternate`,
              }} />
            ))}
          </div>
          {["top-3 left-3 border-t-2 border-l-2 rounded-tl","top-3 right-3 border-t-2 border-r-2 rounded-tr","bottom-3 left-3 border-b-2 border-l-2 rounded-bl","bottom-3 right-3 border-b-2 border-r-2 rounded-br"].map((cls,i) => (
            <span key={i} className={`absolute w-4 h-4 ${cls} border-yellow-500/40`} />
          ))}
          <div className="absolute left-0 right-0 h-px pointer-events-none" style={{ background:"linear-gradient(to right,transparent,rgba(251,191,36,0.2),transparent)", animation:"scanLine 4s linear infinite" }} aria-hidden="true" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 pointer-events-none" style={{ background:"radial-gradient(ellipse,rgba(251,191,36,0.07) 0%,transparent 70%)" }} aria-hidden="true" />
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-14 gap-1">
            <p className="text-xs tracking-widest uppercase mb-3" style={{ color:"rgba(251,191,36,0.8)", animation:"fadeUp 0.8s ease forwards", opacity:0 }}>
              Welcome back, {user?.name || "User"}
            </p>
            <h1 className="text-4xl font-bold text-white mb-2 leading-tight" style={{ animation:"fadeUp 0.8s 0.2s ease forwards", opacity:0 }}>
              Discover <span className="text-yellow-400">Premium</span> Tech<br />at ShopZone
            </h1>
            <p className="text-sm mb-7" style={{ color:"rgba(255,255,255,0.4)", animation:"fadeUp 0.8s 0.35s ease forwards", opacity:0 }}>
              {products.length}+ products across {categoryCount} categories — curated just for you
            </p>
            <div className="flex gap-2.5 flex-wrap justify-center" style={{ animation:"fadeUp 0.8s 0.5s ease forwards", opacity:0 }}>
              {categories.map(({ icon, name, cat }) => (
                <button key={cat} onClick={() => handleNavigate(`/products?category=${cat}`)}
                  className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-250"
                  style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", minWidth:"76px" }}
                  onMouseEnter={e => { e.currentTarget.style.background="rgba(251,191,36,0.12)"; e.currentTarget.style.borderColor="rgba(251,191,36,0.4)"; e.currentTarget.style.transform="translateY(-4px) scale(1.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.transform=""; }}
                >
                  <span className="text-2xl leading-none">{icon}</span>
                  <span className="text-xs font-semibold" style={{ color:"rgba(255,255,255,0.85)" }}>{name}</span>
                  <span className="text-[10px]" style={{ color:"rgba(251,191,36,0.7)" }}>Shop now</span>
                </button>
              ))}
            </div>
            <button onClick={() => handleNavigate("/products")}
              className="mt-5 px-7 py-2.5 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200"
              style={{ background:"rgba(251,191,36,0.15)", border:"1px solid rgba(251,191,36,0.5)", color:"#fbbf24", animation:"fadeUp 0.8s 0.65s ease forwards", opacity:0 }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(251,191,36,0.25)"; e.currentTarget.style.transform="scale(1.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.background="rgba(251,191,36,0.15)"; e.currentTarget.style.transform=""; }}
            >
              Explore All Products →
            </button>
          </div>
          <style>{`
            @keyframes twinkle { 0%{opacity:.1} 100%{opacity:.7} }
            @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
            @keyframes scanLine { 0%{top:-2px;opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{top:102%;opacity:0} }
          `}</style>
        </section>

        {/* ── Featured Products ── */}
        <section>
          <SectionHeader title="⭐ Featured Products" subtitle="Handpicked top sellers" onViewAll={() => handleNavigate("/products")} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* ── Recently Viewed ── */}
        {uniqueRecentlyViewed.length > 0 && (
          <section>
            <SectionHeader title="🕐 Recently Viewed" subtitle="Pick up where you left off" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {uniqueRecentlyViewed.map((item) => (
                <div key={item.id} onClick={() => handleNavigate(`/products/${item.productId}`)}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-amber-100/40 dark:hover:shadow-amber-900/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
                  <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900 flex-shrink-0">
                    <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  </div>
                  <div className="p-3 flex flex-col flex-1 gap-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-blue-500 dark:text-blue-400">{item.category}</span>
                    <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">by <span className="font-semibold text-blue-600 dark:text-blue-400">{item.brand}</span></p>
                    <StarRating rating={item.rating} reviews={item.reviews} showCount={false} />
                    <p className="text-base font-extrabold text-gray-900 dark:text-white mt-auto pt-1">₹{item.price?.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Hot Deals ── */}
        <section>
          <SectionHeader title="🔥 Hot Deals" subtitle="Most reviewed by customers" onViewAll={() => handleNavigate("/products")} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {hotDeals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* ── Top Rated ── */}
        <section>
          <SectionHeader title="🏆 Top Rated" subtitle="Highest customer ratings" onViewAll={() => handleNavigate("/products")} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {topRated.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>

        {/* ── Wishlist Preview ── IMPROVED CARDS ── */}
        {wishlistItems.length > 0 && (
          <section>
            <SectionHeader title="❤️ Your Wishlist" onViewAll={() => handleNavigate("/wishlist")} viewAllLabel={`View all (${wishlistItems.length}) →`} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {wishlistItems.slice(0, 6).map((item) => (
                <div key={item.id} onClick={() => handleNavigate(`/products/${item.id}`)}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-pink-100/40 dark:hover:shadow-pink-900/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
                  {/* Image — fixed height so text always shows */}
                  <div className="h-36 overflow-hidden bg-gray-100 dark:bg-gray-900 flex-shrink-0">
                    <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  </div>
                  {/* Text block — always visible */}
                  <div className="p-3 flex flex-col gap-1.5 flex-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-pink-500 dark:text-pink-400">{item.category}</span>
                    <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">by <span className="font-semibold text-blue-600 dark:text-blue-400">{item.brand}</span></p>
                    <p className="text-base font-extrabold text-gray-900 dark:text-white mt-auto pt-1">₹{item.price?.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Cart Preview ── IMPROVED CARDS ── */}
        {cartItems.length > 0 && (
          <section>
            <SectionHeader title="🛒 Your Cart" onViewAll={() => handleNavigate("/cart")} viewAllLabel={`View cart (${cartCount} items) →`} />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {cartItems.slice(0, 6).map((item) => (
                <div key={item.id} onClick={() => handleNavigate(`/products/${item.id}`)}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-amber-100/40 dark:hover:shadow-amber-900/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col">
                  {/* Image — fixed height */}
                  <div className="h-36 overflow-hidden bg-gray-100 dark:bg-gray-900 flex-shrink-0">
                    <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                  </div>
                  {/* Text block */}
                  <div className="p-3 flex flex-col gap-1.5 flex-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-amber-500 dark:text-amber-400">{item.category}</span>
                    <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">by <span className="font-semibold text-blue-600 dark:text-blue-400">{item.brand}</span></p>
                    <div className="mt-auto pt-1 flex items-center justify-between">
                      <p className="text-base font-extrabold text-gray-900 dark:text-white">₹{(item.price * item.quantity)?.toLocaleString("en-IN")}</p>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">×{item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* ── Gap before footer ── */}
      <div className="h-10" />

      {/* ══════════════════════════════════════
          FOOTER — 6-column professional design
      ══════════════════════════════════════ */}
      <footer style={{ background: "linear-gradient(180deg, #0d0d1a 0%, #080810 100%)", borderTop: "1px solid rgba(251,191,36,0.15)" }}>

        {/* Main footer grid */}
        <div className="px-6 sm:px-10 pt-12 pb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">

            {/* Col 1 — Brand + Subscribe */}
            <div className="col-span-2 sm:col-span-3 lg:col-span-2">
              {/* Logo */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm" style={{ background:"linear-gradient(135deg,#fbbf24,#f59e0b)", color:"#0a0a0f" }}>SZ</div>
                <span className="text-lg font-bold"><span className="text-yellow-400">Shop</span><span className="text-white">Zone</span></span>
              </div>
              <p className="text-xs leading-relaxed mb-5" style={{ color:"rgba(255,255,255,0.4)", maxWidth:"240px" }}>
                One-stop destination for premium tech — mobiles, laptops, audio, gaming, and more.
              </p>

              {/* Contact section moved here */}
              <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color:"rgba(251,191,36,0.7)" }}>Contact</p>
              <div className="flex flex-col gap-2">
                {[
                  { icon:"🔗", label:"Connect",          href:"#"                              },
                  { icon:"💬", label:"Live Chat",         href:"#"                              },
                  { icon:"📞", label:"Customer Service",  href:"#"                              },
                  { icon:"✉️", label:"support@shopzone.com", href:"mailto:support@shopzone.com" },
                ].map(({ icon, label, href }) => (
                  <a key={label} href={href}
                    className="flex items-center gap-2 text-xs transition-colors duration-150 no-underline"
                    style={{ color:"rgba(255,255,255,0.45)", textDecoration:"none" }}
                    onMouseEnter={e => e.currentTarget.style.color="#fbbf24"}
                    onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.45)"}
                  >
                    <span className="text-sm">{icon}</span> {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 2 — Subscribe links */}
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color:"rgba(251,191,36,0.7)" }}>Explore</p>
              <div className="flex flex-col gap-3">
                {[
                  { icon:"🎯", label:"Our Mission" },
                  { icon:"📝", label:"Blog / Articles" },
                  { icon:"💼", label:"Career" },
                ].map(({ icon, label }) => (
                  <button key={label} className="flex items-center gap-2 text-left text-xs cursor-pointer transition-colors duration-150 group/link"
                    style={{ background:"none", border:"none", padding:0, color:"rgba(255,255,255,0.5)" }}
                    onMouseEnter={e => e.currentTarget.style.color="#fff"}
                    onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.5)"}
                  >
                    <span className="text-sm">{icon}</span> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Col 3 — Quick Links */}
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color:"rgba(251,191,36,0.7)" }}>Quick Links</p>
              <div className="flex flex-col gap-3">
                {[
                  { icon:"🏠", label:"Home",         path:"/"         },
                  { icon:"🛍️", label:"All products",  path:"/products" },
                  { icon:"❤️", label:"My wishlist",   path:"/wishlist" },
                  { icon:"🛒", label:"My cart",       path:"/cart"     },
                  { icon:"👤", label:"My profile",    path:"/profile"  },
                ].map(({ icon, label, path }) => (
                  <button key={path} onClick={() => handleNavigate(path)}
                    className="flex items-center gap-2 text-left text-xs cursor-pointer transition-colors duration-150"
                    style={{ background:"none", border:"none", padding:0, color:"rgba(255,255,255,0.5)" }}
                    onMouseEnter={e => e.currentTarget.style.color="#fff"}
                    onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.5)"}
                  >
                    <span className="text-sm">{icon}</span> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Col 4 — My Account */}
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color:"rgba(251,191,36,0.7)" }}>My Account</p>
              <div className="flex flex-col gap-3">
                {[
                  { icon:"🔐", label:"Login / Register" },
                  { icon:"📦", label:"Order History"    },
                  { icon:"💳", label:"Payment Methods"  },
                  { icon:"⚙️", label:"Account Settings" },
                ].map(({ icon, label }) => (
                  <button key={label}
                    className="flex items-center gap-2 text-left text-xs cursor-pointer transition-colors duration-150"
                    style={{ background:"none", border:"none", padding:0, color:"rgba(255,255,255,0.5)" }}
                    onMouseEnter={e => e.currentTarget.style.color="#fff"}
                    onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.5)"}
                  >
                    <span className="text-sm">{icon}</span> {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Col 5 — Find us on + Contact */}
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-4" style={{ color:"rgba(251,191,36,0.7)" }}>Find us on</p>
              <div className="flex flex-col gap-2.5 mb-6">
                {[
                  { icon:"📷", label:"Instagram",       bg:"linear-gradient(135deg,#f09433,#dc2743)", url:"https://instagram.com"  },
                  { icon:"📘", label:"Facebook",         bg:"#1877f2",                                 url:"https://facebook.com"   },
                  { icon:"✕",  label:"Twitter / X",     bg:"#000",                                    url:"https://x.com"          },
                  { icon:"🌐", label:"Official website", bg:"rgba(251,191,36,0.2)",                    url:"https://shopzone.com"   },
                ].map(({ icon, label, bg, url }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-150 no-underline"
                    style={{ border:"1px solid rgba(255,255,255,0.07)", background:"rgba(255,255,255,0.02)", textDecoration:"none" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(251,191,36,0.4)"; e.currentTarget.style.background="rgba(251,191,36,0.07)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.background="rgba(255,255,255,0.02)"; }}
                  >
                    <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs flex-shrink-0" style={{ background:bg }}>{icon}</div>
                    <span className="text-xs" style={{ color:"rgba(255,255,255,0.7)" }}>{label}</span>
                  </a>
                ))}
              </div>

            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div className="px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[11px]" style={{ color:"rgba(255,255,255,0.25)" }}>
              © 2025 <span style={{ color:"rgba(251,191,36,0.6)" }}>ShopZone</span>. All rights reserved.
            </p>
            <p className="text-[11px] flex items-center gap-1" style={{ color:"rgba(255,255,255,0.2)" }}>
              Made with <span className="text-red-500">❤️</span> in India
            </p>
          </div>
        </div>

      </footer>
    </>
  );
}

function SectionHeader({ title, subtitle, onViewAll, viewAllLabel = "View all →" }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {onViewAll && (
        <button onClick={onViewAll} className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer flex-shrink-0 mt-0.5">
          {viewAllLabel}
        </button>
      )}
    </div>
  );
}

export default Dashboard;
