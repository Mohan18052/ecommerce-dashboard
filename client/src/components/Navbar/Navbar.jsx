import { memo, useState, useCallback, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { logout } from "../../features/auth/authSlice";
import { toggleTheme } from "../../features/theme/themeSlice";
import { selectCartCount } from "../../features/cart/cartSlice";
import { useGetWishlistCount } from "../../features/wishlist/wishlistApi";
import useOnlineStatus from "../../hooks/useOnlineStatus";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const cartCount = useSelector(selectCartCount);
  const theme = useSelector((state) => state.root.theme.mode);
  const user = useSelector((state) => state.root.auth.user);
  const isOnline = useOnlineStatus();
  const { wishlistCount } = useGetWishlistCount();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login");
    setDropdownOpen(false);
  }, [dispatch, navigate]);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
      setMobileMenuOpen(false);
      setDropdownOpen(false);
    },
    [navigate]
  );

  const isActive = (path) => location.pathname === path;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <nav className="bg-primary text-white border-b-2 border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 gap-4">

            {/* Logo */}
            <button
              onClick={() => handleNavigate("/")}
              className="flex items-center gap-1.5 flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <span className="text-xl">🛒</span>
              <span className="text-lg font-bold tracking-tight">
                <span className="text-accent">Shop</span>
                <span className="text-white">Zone</span>
              </span>
            </button>

            {/* Desktop Center Nav */}
            <div className="hidden md:flex items-center gap-1">
              <NavButton label="Dashboard" onClick={() => handleNavigate("/")} active={isActive("/")} icon="⊞" />
              <NavButton label="Products" onClick={() => handleNavigate("/products")} active={isActive("/products")} icon="📦" />
              <NavButton label="Cart" badge={cartCount} onClick={() => handleNavigate("/cart")} active={isActive("/cart")} icon="🛒" />
              <NavButton label="Wishlist" badge={wishlistCount} onClick={() => handleNavigate("/wishlist")} active={isActive("/wishlist")} icon="❤️" />
            </div>

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center gap-2">
              {/* Online status */}
              <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
                <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400" : "bg-red-400"}`} />
                <span className="text-gray-300">{isOnline ? "Online" : "Offline"}</span>
              </div>

              {/* Theme toggle */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 rounded-lg bg-white/10 hover:bg-accent/20 hover:text-accent border border-white/10 transition-all duration-200 text-base cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>

              {/* Hamburger dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 cursor-pointer ${
                    dropdownOpen
                      ? "bg-accent/20 border-accent/40 text-accent"
                      : "bg-white/10 border-white/10 text-gray-300 hover:bg-accent/15 hover:border-accent/30 hover:text-accent"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="text-accent font-semibold text-xs">{user?.name || "User"}</span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-48 bg-primary-light border border-accent/20 rounded-xl shadow-2xl overflow-hidden z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-white/8">
                      <p className="text-[10px] text-gray-400 mb-0.5">Signed in as</p>
                      <p className="text-sm font-bold text-accent">{user?.name || "User"}</p>
                    </div>

                    {/* Profile */}
                    <button
                      onClick={() => handleNavigate("/profile")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/8 hover:text-white transition-colors cursor-pointer"
                    >
                      <span className="text-base">👤</span>
                      <span>Profile</span>
                    </button>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 border-t border-white/8 transition-colors cursor-pointer"
                    >
                      <span className="text-base">🚪</span>
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg cursor-pointer"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-light border-t border-white/10">
          <div className="px-4 py-3 space-y-1">
            <MobileNavButton label="Dashboard" onClick={() => handleNavigate("/")} active={isActive("/")} />
            <MobileNavButton label="Products" onClick={() => handleNavigate("/products")} active={isActive("/products")} />
            <MobileNavButton label={`Cart (${cartCount})`} onClick={() => handleNavigate("/cart")} active={isActive("/cart")} />
            <MobileNavButton label={`Wishlist (${wishlistCount})`} onClick={() => handleNavigate("/wishlist")} active={isActive("/wishlist")} />
            <MobileNavButton label="Profile" onClick={() => handleNavigate("/profile")} active={isActive("/profile")} />
            <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400" : "bg-red-400"}`} />
                <span className="text-xs text-gray-300">{isOnline ? "Online" : "Offline"}</span>
              </div>
              <button onClick={() => dispatch(toggleTheme())} className="text-lg cursor-pointer">
                {theme === "light" ? "🌙" : "☀️"}
              </button>
              <button
                onClick={handleLogout}
                className="text-xs bg-accent hover:bg-accent-hover text-primary font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function NavButton({ label, badge, onClick, active, icon }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
        active
          ? "bg-accent/20 text-accent border border-accent/30"
          : "text-gray-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon && <span className="text-sm leading-none">{icon}</span>}
      <span>{label}</span>
      {badge > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-accent text-primary text-[9px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-md">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}

function MobileNavButton({ label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        active ? "bg-accent/20 text-accent" : "text-gray-200 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

export default memo(Navbar);
