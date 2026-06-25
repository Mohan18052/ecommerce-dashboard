import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import {
  selectCartItems,
  selectCartTotal,
  selectCartCount,
  clearCart,
} from "../../features/cart/cartSlice";
import { updateUser } from "../../features/auth/authSlice";
import { useUpdateUserMutation } from "../../features/auth/usersApi";
import { useCreateOrderMutation } from "../../features/orders/ordersApi";

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const user = useSelector((state) => state.root.auth.user);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);

  // RTK Query mutations
  const [patchProfile] = useUpdateUserMutation();
  const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();

  // UI States
  const [errors, setErrors] = useState({});
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [saveProfileDetails, setSaveProfileDetails] = useState(true);
  const orderPlacedRef = useRef(false);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderPlacedRef.current) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  // Form states
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [paymentMethod, setPaymentMethod] = useState("cod"); // 'cod' or 'card'

  // Card details states
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Set document title
  useEffect(() => {
    document.title = "Checkout — ShopZone";
  }, []);

  // Summary calculations matching Cart.jsx
  const shipping = cartTotal > 999 ? 0 : 99;
  const discount = cartTotal > 5000 ? Math.round(cartTotal * 0.05) : 0;
  const finalTotal = cartTotal - discount + shipping;

  // Validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[0-9]{10,15}$/.test(phone.replace(/\s+/g, ""))) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }

    if (!address.trim()) {
      newErrors.address = "Delivery address is required";
    } else if (address.trim().length < 10) {
      newErrors.address = "Please enter a detailed delivery address";
    }

    if (paymentMethod === "card") {
      const cleanCard = cardNumber.replace(/\s+/g, "");
      if (!cleanCard) {
        newErrors.cardNumber = "Card number is required";
      } else if (!/^[0-9]{16}$/.test(cleanCard)) {
        newErrors.cardNumber = "Card number must be 16 digits";
      }

      if (!cardHolder.trim()) {
        newErrors.cardHolder = "Cardholder name is required";
      }

      if (!expiry) {
        newErrors.expiry = "Expiry date is required";
      } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiry)) {
        newErrors.expiry = "Expiry must be MM/YY format";
      }

      if (!cvv) {
        newErrors.cvv = "CVV is required";
      } else if (!/^[0-9]{3,4}$/.test(cvv)) {
        newErrors.cvv = "CVV must be 3 or 4 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [phone, address, paymentMethod, cardNumber, cardHolder, expiry, cvv]);

  // Handle Card Number Formatting
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/(.{4})/g, "$1 ").trim();
    setCardNumber(formattedValue.substring(0, 19));
  };

  // Handle Expiry Formatting (MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setExpiry(value.substring(0, 5));
  };

  // Handle CVV Formatting
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setCvv(value.substring(0, 4));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setPaymentProcessing(true);

    try {
      // 1. If user edited phone/address, optionally save to profile (db.json + local state)
      const phoneChanged = phone.trim() !== (user?.phone || "");
      const addressChanged = address.trim() !== (user?.address || "");

      if (saveProfileDetails && (phoneChanged || addressChanged)) {
        const updatePayload = {
          id: user.id,
          phone: phone.trim(),
          address: address.trim(),
        };

        // Call PATCH /users/:id API mutation
        await patchProfile(updatePayload).unwrap();

        // Update Redux state and localStorage
        dispatch(updateUser({ phone: phone.trim(), address: address.trim() }));
      }

      // 2. Simulate 2-second payment loading state
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 3. Save order to db.json (orders collection)
      const maskedCard = paymentMethod === "card"
        ? `**** **** **** ${cardNumber.replace(/\s+/g, "").slice(-4)}`
        : null;

      const orderPayload = {
        userId: user.id,
        customerName: user.name || "Customer",
        customerEmail: user.email,
        phone: phone.trim(),
        address: address.trim(),
        items: cartItems.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: finalTotal,
        discount,
        shipping,
        paymentMethod: paymentMethod === "cod" ? "Cash On Delivery" : "Card Payment (Fake)",
        paymentDetails: maskedCard ? { cardType: "Visa/Mastercard", cardNumber: maskedCard } : null,
        status: "Success",
        createdAt: new Date().toISOString(),
      };

      // Call POST /orders endpoint
      await createOrder(orderPayload).unwrap();

      // 4. Mark order as placed to prevent empty-cart redirect
      orderPlacedRef.current = true;

      // 5. Clear Redux cart state
      dispatch(clearCart());

      // 6. Navigate to Order Success page
      navigate("/order-success");

    } catch (err) {
      console.error("Order placement failed:", err);
      setErrors({ submit: "Failed to place your order. Please try again." });
    } finally {
      setPaymentProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight">Checkout</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Please review your details and select a payment method.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details & Payment */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Shipping Information Card */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 p-1.5 rounded-lg">📦</span>
                  Shipping & Contact Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name (ReadOnly) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">FULL NAME</label>
                    <input
                      type="text"
                      value={user?.name || ""}
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm font-medium focus:outline-none"
                    />
                  </div>

                  {/* Email (ReadOnly) */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 cursor-not-allowed text-sm font-medium focus:outline-none"
                    />
                  </div>

                  {/* Phone (Editable) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">PHONE NUMBER</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className={`w-full px-4 py-2.5 bg-white dark:bg-gray-900 border ${
                        errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-200 dark:border-gray-600 focus:ring-amber-500"
                      } rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                  </div>

                  {/* Address (Editable) */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">DELIVERY ADDRESS</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your complete delivery address with landmark"
                      rows="3"
                      className={`w-full px-4 py-2.5 bg-white dark:bg-gray-900 border ${
                        errors.address ? "border-red-500 focus:ring-red-500" : "border-gray-200 dark:border-gray-600 focus:ring-amber-500"
                      } rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:border-transparent transition-all resize-none`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1 font-medium">{errors.address}</p>}
                  </div>
                </div>

                {/* Save Profile Checkbox */}
                <div className="mt-4 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="saveProfile"
                    checked={saveProfileDetails}
                    onChange={(e) => setSaveProfileDetails(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-gray-300 text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <label htmlFor="saveProfile" className="text-xs font-semibold text-gray-600 dark:text-gray-300 cursor-pointer select-none">
                    Save address and phone number to my profile
                  </label>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 p-1.5 rounded-lg">💳</span>
                  Select Payment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Cash On Delivery Option */}
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-amber-400 bg-amber-50/20 dark:bg-amber-950/15 ring-2 ring-amber-400"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="w-4 h-4 text-amber-500 border-gray-300 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-bold">Cash On Delivery</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pay in cash when order is delivered</p>
                    </div>
                  </label>

                  {/* Card Payment Option */}
                  <label
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-amber-400 bg-amber-50/20 dark:bg-amber-950/15 ring-2 ring-amber-400"
                        : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                      className="w-4 h-4 text-amber-500 border-gray-300 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <div>
                      <p className="text-sm font-bold">Credit / Debit Card</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Fake simulated online payment</p>
                    </div>
                  </label>
                </div>

                {/* Card Details Subform (Shown only if 'card' selected) */}
                {paymentMethod === "card" && (
                  <div className="p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-150 dark:border-gray-700 space-y-4 animate-fadeIn">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Card Information</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Card Number */}
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">CARD NUMBER</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="0000 0000 0000 0000"
                          className={`w-full px-4 py-2.5 bg-white dark:bg-gray-900 border ${
                            errors.cardNumber ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                          } rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                        />
                        {errors.cardNumber && <p className="text-red-500 text-xs mt-1 font-medium">{errors.cardNumber}</p>}
                      </div>

                      {/* Cardholder Name */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">CARDHOLDER NAME</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="e.g. John Doe"
                          className={`w-full px-4 py-2.5 bg-white dark:bg-gray-900 border ${
                            errors.cardHolder ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                          } rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                        />
                        {errors.cardHolder && <p className="text-red-500 text-xs mt-1 font-medium">{errors.cardHolder}</p>}
                      </div>

                      {/* Expiry and CVV */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">EXPIRY DATE</label>
                          <input
                            type="text"
                            value={expiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            className={`w-full px-4 py-2.5 bg-white dark:bg-gray-900 border ${
                              errors.expiry ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                            } rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                          />
                          {errors.expiry && <p className="text-red-500 text-xs mt-1 font-medium">{errors.expiry}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">CVV</label>
                          <input
                            type="password"
                            value={cvv}
                            onChange={handleCvvChange}
                            placeholder="•••"
                            className={`w-full px-4 py-2.5 bg-white dark:bg-gray-900 border ${
                              errors.cvv ? "border-red-500" : "border-gray-200 dark:border-gray-700"
                            } rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                          />
                          {errors.cvv && <p className="text-red-500 text-xs mt-1 font-medium">{errors.cvv}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm sticky top-20">
                <h3 className="text-lg font-bold mb-4">Order Review</h3>

                {/* Mini Item List */}
                <div className="max-h-48 overflow-y-auto mb-4 pr-1 space-y-3 border-b border-gray-100 dark:border-gray-700/60 pb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3 text-sm">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100 dark:border-gray-700"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-xs truncate">{item.title}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                          Qty: {item.quantity} · ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <p className="font-bold text-xs flex-shrink-0 self-center">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
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
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{finalTotal.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {errors.submit && (
                  <p className="text-red-500 text-xs mt-3 font-semibold text-center">{errors.submit}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={paymentProcessing || isPlacingOrder}
                  className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 disabled:opacity-55 font-bold py-3.5 rounded-xl mt-6 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  {paymentProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                      <span>Simulating Payment...</span>
                    </>
                  ) : isPlacingOrder ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                      <span>Saving Order...</span>
                    </>
                  ) : (
                    <span>Place Order (₹{finalTotal.toLocaleString("en-IN")})</span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  disabled={paymentProcessing || isPlacingOrder}
                  className="w-full text-gray-500 dark:text-gray-400 text-xs font-semibold mt-4 hover:underline cursor-pointer text-center block disabled:opacity-55"
                >
                  Return to Cart
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}

export default Checkout;
