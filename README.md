# 🛒 ShopZone – Production Ready E-Commerce Dashboard

> Built by **Mohan** · React 18 · Redux Toolkit · RTK Query · Redux Persist · React Router v6 · Vite · Tailwind CSS v4

---

## 🚀 Overview

ShopZone is a **production-ready, enterprise-level e-commerce frontend** for an electronics store. It demonstrates real-world frontend architecture patterns including scalable state management, advanced RTK Query caching, performance optimization, authentication flows, offline support, virtualization, optimistic/pessimistic updates, and modern React best practices — all wired to a JSON Server mock backend.

---

## 🏗️ Project Architecture

```
ecommerce-dashboard/
│
├── client/
│   └── src/
│       ├── app/
│       │   ├── store.js          ← Redux store + Redux Persist config
│       │   └── rootReducer.js    ← combineReducers for all slices
│       │
│       ├── services/
│       │   └── baseApi.js        ← Single RTK Query createApi instance
│       │
│       ├── features/
│       │   ├── auth/
│       │   │   ├── authSlice.js      ← user, token, isAuthenticated
│       │   │   └── usersApi.js       ← getUserById, updateUser (optimistic)
│       │   ├── cart/
│       │   │   └── cartSlice.js      ← items, past[], future[] (undo/redo)
│       │   ├── wishlist/
│       │   │   ├── wishlistSlice.js  ← local wishlist + reorder
│       │   │   └── wishlistApi.js    ← server sync (optimistic + pessimistic)
│       │   ├── products/
│       │   │   └── productsApi.js    ← getProducts, getProductById
│       │   ├── orders/
│       │   │   └── ordersApi.js      ← getOrdersByUserId, createOrder
│       │   ├── recentlyViewed/
│       │   │   └── recentlyViewedApi.js ← get + add (optimistic, capped at 10)
│       │   ├── theme/
│       │   │   └── themeSlice.js     ← light / dark mode
│       │   ├── notification/
│       │   │   └── notificationSlice.js ← scaffold (ready to expand)
│       │   └── ui/
│       │       └── uiSlice.js        ← scaffold (ready to expand)
│       │
│       ├── pages/
│       │   ├── Dashboard/        ← hero, featured, hot deals, top rated
│       │   ├── Products/         ← search, filters, infinite scroll, virtualize
│       │   ├── Product/          ← single product detail
│       │   ├── Cart/             ← undo/redo, pagination, suggestions
│       │   ├── Wishlist/         ← drag & drop, paginate, move to cart
│       │   ├── Checkout/         ← address, payment, order creation
│       │   ├── OrderSuccess/     ← confirmation page
│       │   ├── Profile/          ← 4 tabs: info, orders, security, danger zone
│       │   ├── Login/            ← email + password auth
│       │   ├── Register/         ← new user creation
│       │   ├── ForgotPassword/   ← email lookup → sessionStorage handshake
│       │   └── ResetPassword/    ← PATCH password → redirect login
│       │
│       ├── components/
│       │   ├── Navbar/           ← auth state, cart count, wishlist count
│       │   ├── ProductCard/      ← React.memo wrapped
│       │   ├── VirtualizedList/  ← react-window FixedSizeGrid
│       │   ├── StatCard/         ← dashboard KPI tiles
│       │   ├── Pagination/       ← reusable page control
│       │   ├── StarRating/       ← rating display
│       │   ├── Loader/           ← skeleton shimmer
│       │   ├── OfflineBanner/    ← useOnlineStatus driven
│       │   └── ErrorBoundary/    ← class component error catch
│       │
│       ├── hooks/
│       │   ├── useDebounce.js            ← 300ms search delay
│       │   ├── useInfiniteScroll.js      ← IntersectionObserver + callback
│       │   ├── useIntersectionObserver.js← generic observer hook
│       │   ├── useOnlineStatus.js        ← navigator.onLine + events
│       │   ├── usePagination.js          ← slice data by page
│       │   ├── usePrevious.js            ← ref-based previous value
│       │   ├── useAppDispatch.js         ← typed dispatch wrapper
│       │   └── useAppSelector.js         ← typed selector wrapper
│       │
│       ├── router/
│       │   ├── AppRouter.jsx     ← all routes, lazy imports, Suspense
│       │   └── ProtectedRoute.jsx← isAuthenticated guard → /login
│       │
│       ├── App.jsx
│       ├── main.jsx              ← Provider + PersistGate
│       └── index.css
│
└── server/                       ← JSON Server mock backend (port 4000)
    └── db.json                   ← users, products, orders, wishlist, recentlyViewed
```

---

## 🧩 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        React UI Layer                        │
│  Pages (lazy loaded)  +  Components (React.memo)            │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                     React Router v6                          │
│  AppRouter → ProtectedRoute → Page Component                │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                      Redux Store                             │
│                                                             │
│   state.root (persistedReducer)    state.api (RTK Query)   │
│   ├── auth    (persisted)          ├── productsApi          │
│   ├── cart    (NOT persisted)      ├── usersApi             │
│   ├── wishlist(persisted)          ├── wishlistApi          │
│   ├── theme   (persisted)          ├── ordersApi            │
│   ├── notification (scaffold)      └── recentlyViewedApi    │
│   └── ui          (scaffold)                                │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│              services/baseApi.js  (Single RTK Query Slice)  │
│  createApi → injectEndpoints from all feature files         │
│  Custom baseQuery: retry once, auto logout on 401/403       │
│  refetchOnFocus: true  │  refetchOnReconnect: true          │
└───────────────────────────────┬─────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────┐
│              JSON Server Mock Backend (port 4000)            │
│  GET/POST/PATCH/DELETE on:                                   │
│  /users  /products  /orders  /wishlist  /recentlyViewed     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 State Management Diagram

```
User Action (click, type, submit)
              │
              ▼
     React Component
              │
    ┌─────────┴──────────┐
    │                    │
    ▼                    ▼
dispatch()         RTK Query Hook
(sync action)      (useGetProductsQuery etc.)
    │                    │
    ▼                    ▼
Redux Slice        baseApi middleware
(authSlice,        → fetch JSON Server
 cartSlice etc.)   → cache result
    │                    │
    └─────────┬──────────┘
              ▼
         Redux Store
              │
         useSelector
         (memoized selectors)
              │
              ▼
      Component Re-render
      (only if selected state changed)
```

---

## 🌐 API Layer — baseApi.js Architecture

```
baseApi (createApi)
│
├── reducerPath: "api"            → state.api in Redux store
├── refetchOnFocus: true          → refetch when tab regains focus
├── refetchOnReconnect: true      → refetch when browser comes online
│
├── baseQuery: baseQueryWithErrorHandling
│   ├── fetchBaseQuery({ baseUrl: "http://localhost:4000" })
│   ├── On error (not 401/403) → wait 1s → retry once
│   ├── On 401/403 → dispatch logout() → redirect /login
│   └── Attach friendlyMessage to all error objects
│
└── tagTypes: ["Users","Products","Cart","Wishlist","RecentlyViewed"]
    └── used for cache invalidation across all injected endpoints

Injected endpoints (via injectEndpoints):
├── productsApi    → getProducts, getProductById
├── usersApi       → getUserById, updateUser
├── wishlistApi    → getWishlist, addWishlistItem, removeWishlistItem
├── ordersApi      → getOrdersByUserId, createOrder
└── recentlyViewedApi → getRecentlyViewed, addRecentlyViewed
```

---

## ⚡ RTK Query Cache Strategy

```
┌──────────────────────────────────────────────────────────────┐
│                   RTK Query Cache Strategy                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  SINGLE API SLICE                                            │
│  One createApi → all endpoints injected → one shared cache   │
│                                                              │
│  TAG-BASED INVALIDATION                                      │
│  Query provides → [{ type: "Wishlist", id: item.id },        │
│                    { type: "Wishlist", id: "LIST" }]          │
│  Mutation invalidates → [{ type: "Wishlist", id: "LIST" }]   │
│  Result: only the affected list refetches, not everything    │
│                                                              │
│  MANUAL CACHE UPDATES (updateQueryData)                      │
│  ├── removeWishlistItem: OPTIMISTIC remove → undo on fail    │
│  ├── addWishlistItem: PESSIMISTIC add → only after confirm   │
│  ├── addRecentlyViewed: OPTIMISTIC prepend + dedup + cap 10  │
│  └── updateUser: OPTIMISTIC field merge → undo on fail       │
│                                                              │
│  KEEP UNUSED DATA                                            │
│  ├── products:        120s                                   │
│  ├── wishlist:        120s                                   │
│  ├── recentlyViewed:  300s                                   │
│  └── user by ID:      300s                                   │
│                                                              │
│  POLLING                                                     │
│  Products page: pollingInterval: 30000 (30s live refresh)   │
│                                                              │
│  AUTO REFETCH                                                │
│  refetchOnFocus + refetchOnReconnect (via setupListeners)   │
│  refetchOnMountOrArgChange: 30 (usersApi)                   │
│                                                              │
│  CACHE NOT PERSISTED                                         │
│  RTK Query cache never written to localStorage              │
│  Server data always fresh on app load                       │
└──────────────────────────────────────────────────────────────┘
```

---

## 💾 Redux Persist Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                  Redux Persist Config                        │
├──────────────────┬──────────────────────────────────────────┤
│    PERSISTED     │           NOT PERSISTED                  │
│  (localStorage)  │                                          │
├──────────────────┼──────────────────────────────────────────┤
│  auth            │  cart     → stale prices = bad UX        │
│  wishlist        │  notification → ephemeral toasts         │
│  theme           │  ui       → transient modal state        │
│                  │  RTK Query cache → always refetch fresh  │
├──────────────────┴──────────────────────────────────────────┤
│  key: "root"  │  version: 1  │  storage: localStorage       │
├─────────────────────────────────────────────────────────────┤
│  MIGRATION v0 → v1                                          │
│  Adds cart.past[] and cart.future[] to old sessions         │
│  Prevents undo/redo crash on existing persisted data        │
├─────────────────────────────────────────────────────────────┤
│  LOGOUT PURGE                                               │
│  persistor.purge() wipes all persisted state on logout      │
│  Next user on same device starts completely fresh           │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication — Internal Flow

### Login Flow
```
User submits email + password
        │
        ▼
fetch("http://localhost:4000/users")
        │
        ▼
find user where email + password match
        │
   ┌────┴────┐
   │ found   │ not found
   ▼         ▼
dispatch    setError("Invalid email or password")
loginSuccess({ user, token: "fake-jwt-token" })
        │
        ▼
authSlice updates:
  state.user = user
  state.token = "fake-jwt-token"
  state.isAuthenticated = true
  localStorage.setItem("user", JSON.stringify(user))
        │
        ▼
navigate("/")  →  Dashboard
```

### Auto-Logout on 401/403
```
Any RTK Query request
        │
        ▼
baseQueryWithErrorHandling detects 401 or 403
        │
        ▼
api.dispatch(logout())
        │
        ▼
authSlice clears state + localStorage
        │
        ▼
window.location.href = "/login"
```

### Forgot Password + Reset Flow
```
ForgotPassword.jsx
        │
        ▼
GET /users?email=<input>
        │
   ┌────┴─────┐
   │ found    │ not found → show error
   ▼
sessionStorage.setItem("resetUserId", user.id)
sessionStorage.setItem("resetEmail", email)
        │
        ▼
navigate("/reset-password")

ResetPassword.jsx
        │
        ▼
reads sessionStorage (if missing → redirect back)
        │
        ▼
validate new password (min 6 chars, passwords match)
        │
        ▼
PATCH /users/:id  { password: newPassword }
        │
        ▼
sessionStorage.clear()  →  navigate("/login")
```

---

## 🛍️ Product Management — Internal Flow

### Products Page Filter Pipeline
```
useGetProductsQuery()  [polling every 30s]
        │
        ▼
All products in RTK Query cache
        │
        ▼
filteredProducts useMemo runs when any filter changes:
  1. debouncedSearch  → title / brand / category contains query
  2. category         → exact category match
  3. specialFilter    → hot (top 30 by reviews) / featured / new (last 40)
  4. appliedMin/Max   → price range (only after "Apply" button click)
  5. minRating        → rating >= threshold
  6. inStockOnly      → stock > 0
  7. sort             → low-high / high-low / rating / reviews
  8. brokenImages     → push broken-image products to the end
        │
        ▼
visibleProducts = filteredProducts.slice(0, visibleCount)
        │
        ▼
Render grid  →  loaderRef at bottom
        │
        ▼
useInfiniteScroll(loaderRef, loadMore)
  when loaderRef enters viewport → visibleCount += 20
```

### transformResponse — Data Normalization
```
Raw JSON Server response
        │
        ▼
transformResponse applies safe defaults:
  title     → "Untitled Product" if missing
  price     → 0 if missing
  stock     → 0 if missing
  rating    → 0 if missing
  reviews   → 0 if missing
  featured  → false if missing
  brand     → "Unknown" if missing
        │
        ▼
Normalized product array stored in RTK Query cache
```

---

## 🛒 Cart — Internal Flow

### Cart State Shape
```
{
  items:  [{ id, title, price, quantity, image, ... }],
  past:   [ [...items_snapshot], [...items_snapshot] ],   ← undo history
  future: [ [...items_snapshot] ]                          ← redo history
}
```

### Every Mutation Saves History
```
addToCart / removeFromCart / incrementQuantity /
decrementQuantity / clearCart
        │
        ▼
state.past.push([...state.items])   ← snapshot before change
if past.length > 20 → past.shift()  ← cap at 20 entries
state.future = []                   ← clear redo on new action
        │
        ▼
apply the actual mutation
```

### Undo / Redo
```
undoCart:
  pop from past[]  →  push current items to future[]  →  restore items

redoCart:
  pop from future[]  →  push current items to past[]  →  restore items
```

### Pricing Logic
```
cartTotal = sum(item.price × item.quantity)
shipping  = cartTotal > ₹999  ?  FREE  :  ₹99
discount  = cartTotal > ₹5000 ?  cartTotal × 5%  :  0
finalTotal = cartTotal - discount + shipping
```

---

## ❤️ Wishlist — Internal Flow

### Optimistic vs Pessimistic Updates
```
REMOVE (Optimistic):
  updateQueryData immediately removes item from cache
        │
        ▼
  DELETE /wishlist/:id fires in background
        │
   ┌────┴──────┐
   │ success   │ failure → patchResult.undo() restores item
   ▼
  Done — UI already updated, user sees instant feedback

ADD (Pessimistic):
  POST /wishlist fires first
        │
        ▼
  await queryFulfilled  (wait for server confirmation)
        │
        ▼
  updateQueryData appends new item (with real server ID)
  deduplication check prevents double entries
```

### Drag and Drop Reorder
```
HTML5 native drag API (no library)
        │
dragStart → setDragIndex(globalIdx)
dragOver  → setDragOverIndex(globalIdx) → shows highlight border
drop      → splice dragIndex out → splice into toIndex
        │
        ▼
setLocalItems(reordered)   ← client-side only, NOT saved to server
```

---

## 💳 Checkout — Internal Flow

### 6-Step Order Placement
```
User clicks "Place Order"
        │
        ▼
Step 1: validateForm()
  phone: required, 10-15 digits regex
  address: required, min 10 chars
  card number: 16 digits (if card selected)
  cardholder: required
  expiry: MM/YY format
  CVV: 3-4 digits
        │
        ▼
Step 2: if address/phone changed AND checkbox checked
  PATCH /users/:id  (useUpdateUserMutation)
  dispatch updateUser() to sync Redux + localStorage
        │
        ▼
Step 3: await new Promise(resolve => setTimeout(resolve, 2000))
  Simulates 2-second payment processing
  Shows "Simulating Payment..." spinner
        │
        ▼
Step 4: POST /orders  (useCreateOrderMutation)
  Payload includes: userId, items, totalAmount,
  discount, shipping, paymentMethod, maskedCard,
  status: "Success", createdAt: ISO timestamp
        │
        ▼
Step 5: orderPlacedRef.current = true
  Prevents empty-cart useEffect from redirecting to /cart
  while success modal is visible
        │
        ▼
Step 6: dispatch(clearCart())  →  setShowSuccessModal(true)
  Cart wiped from Redux memory
  Modal shows order confirmation
```

---

## 👤 Profile — Internal Flow

### 4-Tab Architecture
```
Profile Page
│
├── Tab 1: Profile Info
│   EditableField component per field (name, email, phone, address)
│   Click Edit → inline input appears
│   Click Save → PATCH /users/:id (direct fetch, not RTK Query here)
│   dispatch loginSuccess(updatedUser) → Redux + localStorage sync
│
├── Tab 2: Orders
│   useGetOrdersByUserIdQuery(user.id, { skip: !user.id })
│   Renders newest-first ([...orders].reverse())
│   Order ID displayed as SZ-{10000 + order.id}
│   Navigate to this tab from Checkout modal via location.state
│
├── Tab 3: Security (Password Change)
│   Validates current password against user.password in Redux state
│   New password: min 6 chars + strength bar (4-factor scoring)
│   PATCH /users/:id with new password
│   dispatch loginSuccess() to sync
│
└── Tab 4: Danger Zone (Delete Account)
    Two-step confirmation UI
    DELETE /users/:id
    dispatch logout()  →  navigate("/login")
```

### Profile Photo Upload
```
User picks image file (max 2MB)
        │
        ▼
FileReader.readAsDataURL(file)
        │
        ▼
PATCH /users/:id  { profileImage: base64string }
        │
        ▼
dispatch loginSuccess({ user: updatedUser, token })
        │
        ▼
Navbar avatar updates instantly (reads from Redux state)
```

---

## 🚀 Performance Optimizations — What's in the Code

### React Rendering Optimizations
```
React.memo
  └── ProductCard.jsx — skips re-render when product prop unchanged
      Critical: prevents 500+ card re-renders on parent state change

useMemo (used in every major page)
  ├── Products.jsx  → filteredProducts, visibleProducts, hotDealsIds (Set)
  ├── Dashboard.jsx → featuredProducts, topRated, hotDeals, uniqueRecentlyViewed
  ├── Cart.jsx      → paginatedItems, suggestedProducts
  └── Wishlist.jsx  → paginatedItems

useCallback (all event handlers)
  ├── Products.jsx  → loadMore, handleApplyPrice, handleClearAll
  ├── Cart.jsx      → handleIncrement, handleDecrement, handleRemove, handleUndo
  ├── Wishlist.jsx  → handleRemove, handleMoveToCart, drag handlers
  └── Profile.jsx   → patchUser, handleSaveField, handlePhotoChange
```

### Code Splitting + Lazy Loading
```
AppRouter.jsx:
  const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"))
  const Products  = lazy(() => import("../pages/Products/Products"))
  ... (every page is lazy imported)
        │
        ▼
Single <Suspense fallback={<PageLoader />}> wraps all routes
        │
        ▼
Vite creates one JS chunk per page at build time
User downloads only the chunk for the page they visit
```

### Vite Bundle Splitting
```
vite.config.js → manualChunks:

  node_modules/react-dom        →  react-vendor  (largest, rarely changes)
  node_modules/react-router     →  router
  node_modules/@reduxjs /
  node_modules/react-redux /
  node_modules/redux            →  redux

  App pages                     →  one chunk each (from React.lazy)
```

### Virtualization
```
Products page toggle → useVirtualized state
        │
        ▼
<VirtualizedList items={filteredProducts} />
        │
        ▼
react-window FixedSizeGrid
  Only renders DOM nodes for visible rows
  1000 products → ~20 DOM nodes at any time
  Everything else is virtual (scroll position math)
```

### Infinite Scroll
```
<div ref={loaderRef} /> at bottom of products list
        │
useInfiniteScroll(loaderRef, loadMore)
        │
IntersectionObserver watches loaderRef
        │
when loaderRef enters viewport:
  loadMore() → setVisibleCount(prev => prev + 20)
        │
visibleProducts = filteredProducts.slice(0, visibleCount)
```

---

## 🪝 Custom Hooks — Implementation Details

```
useDebounce(value, delay = 300)
  useState(value) → useEffect sets timer → clears on re-run
  Returns stabilized value after delay ms of no change

useInfiniteScroll(loaderRef, callback)
  Creates IntersectionObserver on loaderRef.current
  Fires callback() when element enters viewport
  Cleans up observer on unmount

useIntersectionObserver(ref, callback)
  Generic version of useInfiniteScroll
  Same implementation, different parameter names

useOnlineStatus()
  useState(navigator.onLine) as initial value
  Listens to window "online" and "offline" events
  Returns isOnline boolean (used by OfflineBanner)

usePagination(data, currentPage, itemsPerPage)
  Pure calculation: data.slice(start, end)
  No hooks inside — stateless utility

usePrevious(value)
  useRef stores value → useEffect updates ref after render
  Returns ref.current (one render behind)
  Used for animation comparisons

useAppDispatch / useAppSelector
  Thin wrappers over useDispatch / useSelector
  Ready for TypeScript generic types without changing import sites
```

---

## 🧱 Redux Slices — Complete Reference

```
authSlice
  state:   { user: null, token: null, isAuthenticated: false }
  actions: loginSuccess → sets all + localStorage
           logout       → clears all + localStorage
           updateUser   → merges fields + localStorage

cartSlice  [NOT PERSISTED]
  state:   { items: [], past: [], future: [] }
  actions: addToCart, removeFromCart, incrementQuantity,
           decrementQuantity, clearCart  (all save to past[])
           undoCart, redoCart
  selectors: selectCartItems, selectCartCount, selectCartTotal,
             selectCanUndo, selectCanRedo

wishlistSlice  [PERSISTED]
  state:   { items: [] }
  actions: addToWishlist (dedup check), removeFromWishlist,
           clearWishlist, reorderWishlist (splice + insert)

themeSlice  [PERSISTED]
  state:   { mode: "light" }
  actions: toggleTheme (light ↔ dark)

notificationSlice  [scaffold — ready to expand]
  state:   { notifications: [] }

uiSlice  [scaffold — ready to expand]
  state:   { loading: false }
```

---

## 🗂️ Router — Route Map

```
AppRouter.jsx
│
├── PUBLIC ROUTES (no auth required)
│   ├── /login              → Login.jsx
│   ├── /register           → Register.jsx
│   ├── /forgot-password    → ForgotPassword.jsx
│   └── /reset-password     → ResetPassword.jsx
│
└── PROTECTED ROUTES (ProtectedRoute checks isAuthenticated)
    ├── /                   → Dashboard.jsx
    ├── /products           → Products.jsx
    ├── /products/:id       → Product.jsx
    ├── /cart               → Cart.jsx
    ├── /wishlist           → Wishlist.jsx
    ├── /profile            → Profile.jsx
    ├── /checkout           → Checkout.jsx
    └── /order-success      → OrderSuccess.jsx

ProtectedRoute:
  isAuthenticated === false  →  <Navigate to="/login" />
  isAuthenticated === true   →  render children
```

---

## 📊 Lighthouse Report

> Always run Lighthouse on the **production build**, not the dev server.

```bash
npm run build
npm run preview
```

| Metric          | Dev Mode | Production |
| --------------- | -------- | ---------- |
| Performance     | ~80      | **96**     |
| Accessibility   | —        | **94**     |
| Best Practices  | —        | **100**    |
| SEO             | —        | **92**     |

### Why production scores higher
- Minified + tree-shaken JS bundles
- Vendor chunks cached separately by browser
- Image lazy loading reduces initial payload
- Code splitting eliminates unused JS on first load
- No HMR overhead or source maps

---

## 📦 Bundle Analysis

```
Build output chunks:
├── react-vendor.[hash].js   ← react-dom (cached long-term)
├── router.[hash].js         ← react-router
├── redux.[hash].js          ← @reduxjs/toolkit + react-redux
├── Dashboard.[hash].js      ← loaded only on /
├── Products.[hash].js       ← loaded only on /products
├── Cart.[hash].js           ← loaded only on /cart
├── Checkout.[hash].js       ← loaded only on /checkout
├── Wishlist.[hash].js       ← loaded only on /wishlist
├── Profile.[hash].js        ← loaded only on /profile
├── Login.[hash].js          ← loaded only on /login
└── ...                      ← one chunk per page

Strategy: Vendor code never re-downloads after first visit.
App chunks update only when that specific page changes.
```

---

## ✨ Features — Complete List

### Authentication
- Login with email + password (JSON Server validation)
- Register new user (POST /users)
- Protected routes (ProtectedRoute HOC)
- Persisted authentication (Redux Persist + localStorage)
- Auto logout on 401/403 (baseQuery error handler)
- Forgot password (email lookup → sessionStorage handshake)
- Reset password (PATCH /users/:id → redirect login)
- Profile management (inline edit all fields)

### Product Management
- Full product listing from JSON Server
- Product detail page (/products/:id)
- Debounced search — 300ms delay (title, brand, category)
- Category filter (URL param deep linking from Dashboard)
- Special filters — Hot Deals, Featured, New Arrivals
- Price range filter (min/max, applied only on button click)
- Min rating filter (4.5+, 4.0+, 3.0+)
- In-stock only filter
- Sorting (price low-high, high-low, top rated, most reviewed)
- Infinite scroll (IntersectionObserver, loads 20 at a time)
- Virtualized grid toggle (react-window)
- Polling every 30s for live updates
- transformResponse for safe data defaults
- Broken image detection + push to end of list

### Cart
- Add to cart (quantity increment on duplicate)
- Remove item from cart
- Increment / decrement quantity
- Clear all cart items
- Undo (up to 20 steps)
- Redo
- Order summary with shipping + discount logic
- Paginated cart items (5 per page)
- Suggested products (rating ≥ 4.5, not already in cart)
- Fake checkout flow

### Wishlist
- Add to wishlist (deduplication)
- Remove from wishlist (optimistic update)
- Add (pessimistic update — waits for server ID)
- Drag and drop reorder (HTML5 native, no library)
- Paginated wishlist (12 per page)
- Move to cart (add to cart + remove from wishlist in one click)
- Wishlist count in Navbar via selectFromResult

### Checkout
- Shipping address form (pre-filled from profile)
- Phone number validation
- "Save to profile" checkbox (PATCH /users/:id if ticked)
- Cash on Delivery option
- Credit/Debit card form with auto-formatting
- Card number: groups of 4 with spaces
- Expiry: auto slash after MM
- CVV: numeric only, 3-4 digits
- 2-second simulated payment processing
- Order stored in JSON Server on success
- Success modal with order details
- Navigate to order history from success modal

### User Profile
- Inline editable fields (name, email, phone, address)
- Profile photo upload (base64, max 2MB, stored in JSON Server)
- Password change with strength indicator
- Order history tab (reads from /orders?userId=)
- Account deletion (DELETE /users/:id + logout)
- Persistent across sessions (Redux Persist + localStorage)

### UI Features
- Responsive layout (Tailwind CSS)
- Dark mode / Light mode (themeSlice, persisted)
- Skeleton loading states
- Offline banner (useOnlineStatus)
- Error boundary (class component)
- Retry button on API error
- Empty states (cart, wishlist, orders, products)
- Loading spinners per component
- Cinematic hero section on Dashboard

### Bonus Features
- Undo / Redo cart actions (20-step history)
- Drag and drop wishlist reordering
- Forgot password mock flow
- Reset password mock flow
- Fake payment integration (card + COD)
- Profile image upload
- Optimistic updates on wishlist remove + recently viewed
- Pessimistic updates on wishlist add
- Recently viewed products (capped at 10, optimistic prepend)

---

## 🛠️ Tech Stack

| Technology       | Version  | Purpose                              |
| ---------------- | -------- | ------------------------------------ |
| React            | 18.3.1   | UI library (concurrent features)     |
| Vite             | 8.0.12   | Build tool + dev server              |
| Redux Toolkit    | 2.12.0   | State management + RTK Query         |
| RTK Query        | (in RTK) | Server state, caching, mutations     |
| Redux Persist    | 6.0.0    | Selective localStorage persistence   |
| React Redux      | 9.3.0    | React bindings for Redux             |
| React Router DOM | 6.30.4   | Client-side routing                  |
| react-window     | 1.8.10   | Virtualized lists (FixedSizeGrid)    |
| Tailwind CSS     | 4.3.1    | Utility-first CSS (via Vite plugin)  |
| JSON Server      | —        | Mock REST API backend                |
| ESLint           | 10.3.0   | Code linting                         |
| JavaScript       | ES2020   | Language (TypeScript-ready wrappers) |

---

## ▶️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd ecommerce-dashboard

# Install dependencies
npm install

# Start JSON Server mock backend (port 4000)
cd server
npx json-server --watch db.json --port 4000

# In a new terminal — start the Vite dev server
cd client
npm run dev
```

### For Lighthouse testing (production build)
```bash
cd client
npm run build
npm run preview
```

> Open Chrome DevTools → Lighthouse → Desktop → Run audit on the preview URL

---

## 👨‍💻 Author

**Mohan**

Frontend Developer

React · Redux Toolkit · RTK Query · JavaScript · Tailwind CSS

---

*ShopZone — Production-ready e-commerce frontend demonstrating enterprise-level React architecture.*
