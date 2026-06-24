import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import { useGetProductsQuery } from "../../features/products/productsApi";
import { useGetWishlistQuery } from "../../features/wishlist/wishlistApi";
import { selectCartCount, selectCartTotal } from "../../features/cart/cartSlice";

function Profile() {
  const user = useSelector((state) => state.root.auth.user);
  const cartCount = useSelector(selectCartCount);
  const cartTotal = useSelector(selectCartTotal);

  const { data: products = [] } = useGetProductsQuery();
  const { data: wishlistItems = [] } = useGetWishlistQuery();

  useEffect(() => {
    document.title = "Profile — ShopZone";
  }, []);

  const memberSince = useMemo(() => {
    const date = new Date();
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
    });
  }, []);

  return (
    <>
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Profile
        </h1>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          {/* Banner */}
          <div className="bg-gradient-to-r from-primary via-primary-light to-blue-900 h-32" />

          <div className="px-6 pb-6 -mt-12">
            {/* Avatar */}
            <div className="w-24 h-24 bg-amber-400 rounded-2xl flex items-center justify-center text-4xl font-bold text-primary shadow-lg border-4 border-white dark:border-gray-800">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user?.name || "User"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email || "No email"}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Member since {memberSince} · ID: {user?.id}
              </p>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Account Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InfoField label="Full Name" value={user?.name || "—"} />
            <InfoField label="Email Address" value={user?.email || "—"} />
            <InfoField label="User ID" value={`#${user?.id || "—"}`} />
            <InfoField label="Role" value={user?.role || "Customer"} />
          </div>
        </div>

        {/* Shopping Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Shopping Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard icon="📦" label="Products Available" value={products.length} />
            <SummaryCard icon="🛒" label="Cart Items" value={cartCount} />
            <SummaryCard icon="❤️" label="Wishlist Items" value={wishlistItems.length} />
            <SummaryCard icon="💰" label="Cart Value" value={`₹${cartTotal.toLocaleString("en-IN")}`} />
          </div>
        </div>
      </main>
    </>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

export default Profile;