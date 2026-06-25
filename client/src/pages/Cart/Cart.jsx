import { useState, useCallback, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Pagination from "../../components/Pagination/Pagination";
import ProductCard from "../../components/ProductCard/ProductCard";
import {
  removeFromCart, clearCart, incrementQuantity, decrementQuantity,
  undoCart, redoCart,
  selectCartItems, selectCartTotal, selectCartCount, selectCanUndo, selectCanRedo,
} from "../../features/cart/cartSlice";
import { useGetProductsQuery } from "../../features/products/productsApi";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);
  const canUndo = useSelector(selectCanUndo);
  const canRedo = useSelector(selectCanRedo);

  const { data: allProducts = [] } = useGetProductsQuery();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => { document.title = `Cart (${cartCount}) — ShopZone`; }, [cartCount]);

  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return cartItems.slice(start, start + itemsPerPage);
  }, [cartItems, currentPage]);

  // ── 6 suggestions matching Products page grid ──
  const suggestedProducts = useMemo(() => {
    const cartIds = new Set(cartItems.map((item) => item.id));
    const filtered = allProducts.filter((p) => !cartIds.has(p.id) && p.rating >= 4.5);
    return [...filtered].sort(() => 0.5 - Math.random()).slice(0, 6);
  }, [allProducts, cartItems]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const handleIncrement  = useCallback((id) => dispatch(incrementQuantity(id)), [dispatch]);
  const handleDecrement  = useCallback((id) => dispatch(decrementQuantity(id)), [dispatch]);
  const handleRemove     = useCallback((id) => dispatch(removeFromCart(id)), [dispatch]);
  const handleClearCart  = useCallback(() => dispatch(clearCart()), [dispatch]);
  const handleUndo       = useCallback(() => dispatch(undoCart()), [dispatch]);
  const handleRedo       = useCallback(() => dispatch(redoCart()), [dispatch]);

  const shipping = cartTotal > 999 ? 0 : 99;
  const discount = cartTotal > 5000 ? Math.round(cartTotal * 0.05) : 0;

  const SuggestedSection = () => (
    suggestedProducts.length > 0 ? (
      <section className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">🔥 You might also like</h2>
        {/* ── Same 6-col grid as Products page ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {suggestedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    ) : null
  );

  return (
    <>
      <Navbar />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Shopping Cart</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {cartCount} item{cartCount !== 1 ? "s" : ""} in your cart
            </p>
          </div>
          {cartItems.length > 0 && (
            <div className="flex items-center gap-2">
              <button onClick={handleUndo} disabled={!canUndo}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
                ↩ Undo
              </button>
              <button onClick={handleRedo} disabled={!canRedo}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
                Redo ↪
              </button>
              <button onClick={handleClearCart}
                className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline cursor-pointer ml-2">
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Empty state */}
        {cartItems.length === 0 ? (
          <div className="space-y-8">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Add some products to get started</p>
              <div className="flex gap-3">
                {canUndo && (
                  <button onClick={handleUndo}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-bold px-5 py-3 rounded-xl cursor-pointer transition-colors text-sm">
                    ↩ Undo Clear
                  </button>
                )}
                <button onClick={() => navigate("/products")}
                  className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer">
                  Continue Shopping
                </button>
              </div>
            </div>
            <SuggestedSection />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── Cart Items ── */}
              <div className="lg:col-span-2 space-y-3">
                {paginatedItems.map((item) => (
                  <div key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm flex gap-4 hover:shadow-md transition-shadow">

                    {/* Smaller image */}
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      onClick={() => navigate(`/products/${item.id}`)}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    />

                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        onClick={() => navigate(`/products/${item.id}`)}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.brand} · {item.category}</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white mt-1.5">
                        ₹{item.price?.toLocaleString("en-IN")}
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                          <button onClick={() => handleDecrement(item.id)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer text-lg font-bold">−</button>
                          <span className="w-9 h-8 flex items-center justify-center text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-x border-gray-300 dark:border-gray-600">
                            {item.quantity}
                          </span>
                          <button onClick={() => handleIncrement(item.id)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer text-lg font-bold">+</button>
                        </div>
                        <button onClick={() => handleRemove(item.id)}
                          className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline cursor-pointer">
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col items-end justify-center flex-shrink-0">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Subtotal</p>
                      <p className="text-base font-bold text-gray-900 dark:text-white">
                        ₹{(item.price * item.quantity)?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}

                <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
              </div>

              {/* ── Order Summary ── */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm sticky top-20">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Items ({cartCount})</span>
                      <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (5%)</span>
                        <span>−₹{discount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                      </span>
                    </div>
                    <hr className="border-gray-200 dark:border-gray-700" />
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>₹{(cartTotal - discount + shipping).toLocaleString("en-IN")}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-[11px] text-amber-600">
                        Add ₹{(1000 - cartTotal).toLocaleString("en-IN")} more for free shipping
                      </p>
                    )}
                  </div>
                  <button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3 rounded-xl mt-6 transition-colors shadow-md hover:shadow-lg cursor-pointer text-sm">
                    Proceed to Checkout
                  </button>
                  <button onClick={() => navigate("/products")}
                    className="w-full text-text-link dark:text-blue-400 text-sm font-medium mt-3 hover:underline cursor-pointer">
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>

            {/* ── Suggestions: 6-col grid ── */}
            <SuggestedSection />
          </>
        )}
      </main>
    </>
  );
}

export default Cart;