import { memo, useState, useCallback } from "react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = useSelector(selectCartCount);
  const theme = useSelector((state) => state.root.theme.mode);
  const user = useSelector((state) => state.root.auth.user);
  const isOnline = useOnlineStatus();
  const { wishlistCount } = useGetWishlistCount();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/login");
  }, [dispatch, navigate]);

  const handleNavigate = useCallback(
    (path) => {
      navigate(path);
      setMobileMenuOpen(false);
    },
    [navigate]
  );

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Top Bar */}
      <nav className="bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => handleNavigate("/")}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span className="text-2xl">🛒</span>
              <span className="text-xl font-bold text-accent tracking-tight">
                Shop<span className="text-white">Zone</span>
              </span>
            </button>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <NavButton
                label="Dashboard"
                onClick={() => handleNavigate("/")}
                active={isActive("/")}
              />
              <NavButton
                label="Products"
                onClick={() => handleNavigate("/products")}
                active={isActive("/products")}
              />
              <NavButton
                label={`Cart`}
                badge={cartCount}
                onClick={() => handleNavigate("/cart")}
                active={isActive("/cart")}
                icon="🛒"
              />
              <NavButton
                label="Wishlist"
                badge={wishlistCount}
                onClick={() => handleNavigate("/wishlist")}
                active={isActive("/wishlist")}
                icon="❤️"
              />
              <NavButton
                label="Profile"
                onClick={() => handleNavigate("/profile")}
                active={isActive("/profile")}
                icon="👤"
              />
            </div>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Online/Offline Status */}
              <div className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-white/10">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOnline ? "bg-green-400" : "bg-red-400"
                  }`}
                />
                <span className="text-gray-300">
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-lg cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "light" ? "🌙" : "☀️"}
              </button>

              {/* User greeting + Logout */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-300">
                  Hi, <span className="text-accent font-semibold">{user?.name || "User"}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs bg-accent hover:bg-accent-hover text-primary font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
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
          <div className="px-4 py-3 space-y-2">
            <MobileNavButton label="Dashboard" onClick={() => handleNavigate("/")} active={isActive("/")} />
            <MobileNavButton label="Products" onClick={() => handleNavigate("/products")} active={isActive("/products")} />
            <MobileNavButton label={`Cart (${cartCount})`} onClick={() => handleNavigate("/cart")} active={isActive("/cart")} />
            <MobileNavButton label={`Wishlist (${wishlistCount})`} onClick={() => handleNavigate("/wishlist")} active={isActive("/wishlist")} />
            <MobileNavButton label="Profile" onClick={() => handleNavigate("/profile")} active={isActive("/profile")} />
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-400" : "bg-red-400"}`} />
                <span className="text-xs text-gray-300">{isOnline ? "Online" : "Offline"}</span>
              </div>
              <button onClick={() => dispatch(toggleTheme())} className="text-lg cursor-pointer">
                {theme === "light" ? "🌙" : "☀️"}
              </button>
              <button onClick={handleLogout} className="text-xs bg-accent text-primary font-semibold px-3 py-1.5 rounded-md cursor-pointer">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

// Desktop nav button sub-component
function NavButton({ label, badge, onClick, active, icon }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-all cursor-pointer ${
        active
          ? "bg-white/20 text-accent"
          : "text-gray-200 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon && <span className="text-base">{icon}</span>}
      <span>{label}</span>
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-accent text-primary text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}

// Mobile nav button
function MobileNavButton({ label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
        active
          ? "bg-white/20 text-accent"
          : "text-gray-200 hover:bg-white/10"
      }`}
    >
      {label}
    </button>
  );
}

export default memo(Navbar);