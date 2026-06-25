import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

function OrderSuccess() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Set document title and trigger pop-up animation
  useEffect(() => {
    document.title = "Order Placed Successfully! — ShopZone";
    // Slight delay to trigger a smooth entry transition
    const timer = setTimeout(() => setIsOpen(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Navbar />
      
      {/* Viewport Backdrop with Glassmorphic Blur */}
      <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md transition-opacity duration-500 flex items-center justify-center p-4">
        
        {/* Modal Pop-up Card */}
        <div
          className={`bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-8 border border-slate-100 dark:border-slate-700/60 shadow-2xl text-center space-y-6 transition-all duration-500 transform ${
            isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-90 opacity-0 translate-y-8"
          }`}
        >
          {/* Animated Success Badge */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/35 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-inner animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="w-10 h-10 animate-pulse"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
          </div>

          {/* Title and Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Your Order Is Placed!
            </h1>
            <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              Thank you for buying.
            </p>
          </div>

          {/* Details Card */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl space-y-2 text-xs text-left">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Status</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                Processing
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Estimated Delivery</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">3-5 Working Days</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">Tracking</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">Updates sent to email</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/profile", { state: { activeTab: "orders" } })}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer text-sm"
            >
              View Your Orders
            </button>
            <button
              onClick={() => navigate("/products")}
              className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold py-3.5 rounded-xl transition-all border border-slate-200/60 dark:border-slate-700 cursor-pointer text-sm"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Mock Background (Dashboard Style) */}
      <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 opacity-20 pointer-events-none" />
    </>
  );
}

export default OrderSuccess;
