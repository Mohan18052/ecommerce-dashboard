import { useState, useCallback, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Pagination from "../../components/Pagination/Pagination";
import ProductCard from "../../components/ProductCard/ProductCard";
import {
  removeFromCart,
  clearCart,
  incrementQuantity,
  decrementQuantity,
  selectCartItems,
  selectCartTotal,
  selectCartCount,
} from "../../features/cart/cartSlice";
import { useGetProductsQuery } from "../../features/products/productsApi";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);

  const { data: allProducts = [] } = useGetProductsQuery();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    document.title = `Cart (${cartCount}) — ShopZone`;
  }, [cartCount]);

  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return cartItems.slice(start, start + itemsPerPage);
  }, [cartItems, currentPage]);

  // Suggested products — items NOT in cart, random 4
  const suggestedProducts = useMemo(() => {
    const cartIds = new Set(cartItems.map((item) => item.id));
    const filtered = allProducts.filter((p) => !cartIds.has(p.id) && p.rating >= 4.5);
    const shuffled = [...filtered].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [allProducts, cartItems]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handleIncrement = useCallback(
    (id) => dispatch(incrementQuantity(id)),
    [dispatch]
  );

  const handleDecrement = useCallback(
    (id) => dispatch(decrementQuantity(id)),
    [dispatch]
  );

  const handleRemove = useCallback(
    (id) => dispatch(removeFromCart(id)),
    [dispatch]
  );

  const handleClearCart = useCallback(
    () => dispatch(clearCart()),
    [dispatch]
  );

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="space-y-8">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Your cart is empty
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Add some products to your cart to see them here
              </p>
              <button
                onClick={() => navigate("/products")}
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>

            {/* Suggested Products when cart is empty */}
            {suggestedProducts.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  🔥 Recommended for you
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {suggestedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {cartCount} item{cartCount > 1 ? "s" : ""} in your cart
                  </p>
                  <button
                    onClick={handleClearCart}
                    className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline cursor-pointer"
                  >
                    Clear Cart
                  </button>
                </div>

                {paginatedItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm flex gap-4 hover:shadow-md transition-shadow"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      onClick={() => navigate(`/products/${item.id}`)}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                    />

                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        onClick={() => navigate(`/products/${item.id}`)}
                      >
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {item.brand} · {item.category}
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">
                        ₹{item.price?.toLocaleString("en-IN")}
                      </p>

                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                          <button
                            onClick={() => handleDecrement(item.id)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer text-lg font-bold"
                          >
                            −
                          </button>
                          <span className="w-10 h-8 flex items-center justify-center text-sm font-semibold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border-x border-gray-300 dark:border-gray-600">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item.id)}
                            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer text-lg font-bold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col items-end justify-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Subtotal</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹{(item.price * item.quantity)?.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />
              </div>

              {/* Cart Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm sticky top-20">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Items ({cartCount})</span>
                      <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Shipping</span>
                      <span className="text-success font-medium">FREE</span>
                    </div>
                    <hr className="border-gray-200 dark:border-gray-700" />
                    <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                      <span>Total</span>
                      <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3 rounded-xl mt-6 transition-colors shadow-md hover:shadow-lg cursor-pointer text-sm">
                    Proceed to Checkout
                  </button>

                  <button
                    onClick={() => navigate("/products")}
                    className="w-full text-text-link dark:text-blue-400 text-sm font-medium mt-3 hover:underline cursor-pointer"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>

            {/* Suggested Products Section below cart */}
            {suggestedProducts.length > 0 && (
              <section className="mt-10">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  🔥 You might also like
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {suggestedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default Cart;