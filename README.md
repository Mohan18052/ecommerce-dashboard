# 🛒 ShopZone – Production Ready E-Commerce Dashboard

## 🚀 Overview

ShopZone is a production-ready E-Commerce Dashboard built using **React 18**, **JavaScript**, **Redux Toolkit**, **RTK Query**, **Redux Persist**, **React Router**, **Vite**, and **Tailwind CSS**.

The project demonstrates enterprise-level frontend architecture with scalable state management, advanced RTK Query features, performance optimization techniques, authentication, offline support, virtualization, optimistic updates, responsive UI, and modern React best practices.

---

# ✨ Features

## Authentication

* Login Authentication
* Register New User
* Protected Routes
* Persisted Authentication
* Auto Logout
* Forgot Password
* Reset Password
* Profile Management

---

## Product Management

* Product Listing
* Product Details
* Search Products
* Debounced Search (300ms)
* Category Filter
* Multi Filters
* Price Filter
* Rating Filter
* Sorting
* Featured Products

---

## Cart

* Add to Cart
* Remove from Cart
* Update Quantity
* Undo / Redo
* Order Summary
* Fake Checkout Flow
* Cash on Delivery
* Card Payment Simulation

---

## Wishlist

* Add to Wishlist
* Remove from Wishlist
* Drag and Drop Wishlist Reordering
* Persisted Wishlist

---

## User Profile

* Edit Name
* Edit Email
* Edit Phone Number
* Edit Address
* Upload Profile Picture
* Persist User Details
* Account Settings

---

## Checkout

* Checkout Page
* Shipping Address
* Payment Method Selection
* Fake Payment Processing
* Order Confirmation
* Order Success Page
* Order Storage in Mock Backend

---

## Performance Optimizations

* React.memo
* useMemo
* useCallback
* Lazy Loading
* Route Code Splitting
* Dynamic Imports
* Suspense
* Image Lazy Loading
* Virtualized Product List
* Infinite Scrolling
* Pagination
* Debounced Search
* Optimized Redux Selectors
* Reduced Unnecessary Re-renders

---

## RTK Query Features

* Single API Slice
* Dynamic Endpoint Injection
* Queries
* Mutations
* Lazy Queries
* Polling
* Cache Invalidation
* Optimistic Updates
* Pessimistic Updates
* Prefetching
* Manual Cache Updates
* updateQueryData
* invalidateTags
* transformResponse
* transformErrorResponse
* keepUnusedDataFor
* refetchOnFocus
* refetchOnReconnect
* refetchOnMountOrArgChange
* selectFromResult

---

## Redux Toolkit

### Slices

* Auth
* Cart
* Wishlist
* Theme
* Notification
* UI

### Persisted State

* Authentication
* Wishlist
* Theme

---

## UI Features

* Responsive Dashboard
* Product Grid
* Virtualized Grid
* Infinite Scroll
* Pagination
* Skeleton Loading
* Offline Banner
* Global Error UI
* Error Boundary
* Retry Requests
* Dark Mode
* Light Mode
* Empty States
* Loading States

---

## Bonus Features

* Undo / Redo Cart Actions
* Drag & Drop Wishlist
* Forgot Password Flow
* Reset Password Flow
* Fake Payment Integration
* Profile Editing
* Profile Image Upload
* Responsive Design
* Optimized Lighthouse Score

---

# 🏗️ Project Architecture

```
src
│
├── app
│
├── services
│
├── features
│     ├── auth
│     ├── cart
│     ├── wishlist
│     ├── notification
│     ├── products
│     ├── theme
│     └── ui
│
├── pages
│
├── components
│
├── hooks
│
├── router
│
└── assets
```

---

# 🧩 Architecture Diagram

```
UI Components
      │
      ▼
React Router
      │
      ▼
Redux Store
      │
 ┌────┴────────┐
 │             │
Slices     RTK Query
 │             │
 └────┬────────┘
      ▼
 Mock Backend (JSON Server)
```

---

# 🔄 State Management Diagram

```
User Action
      │
      ▼
Component
      │
Dispatch
      │
Redux Slice
      │
Redux Store
      │
Selector
      │
Component Re-render
```

---

# 🌐 API Layer

The application uses a single RTK Query API Slice.

Features include:

* Dynamic endpoint injection
* Automatic caching
* Polling
* Optimistic updates
* Cache invalidation
* Automatic retries
* Background refetching

---

# ⚡ RTK Query Cache Strategy

* Single API Slice
* Tag Based Invalidation
* Manual Cache Updates
* Optimistic Updates
* Pessimistic Updates
* Prefetching
* Polling
* Lazy Queries
* Automatic Refetch
* Cache Persistence Disabled

---

# 💾 Redux Persist Strategy

Persisted

* Authentication
* Wishlist
* Theme

Not Persisted

* Cart
* Notifications
* RTK Query Cache

Logout automatically purges persisted authentication.

---

# 🚀 Performance Optimization

Implemented

* React.memo
* useMemo
* useCallback
* Route Splitting
* Bundle Splitting
* Dynamic Imports
* Suspense
* Virtualization
* Lazy Image Loading
* Debounced Search
* Infinite Scroll
* Optimized Selectors

---

# 📊 Lighthouse Report

Development Mode (`npm run dev`)

Performance : **~80**

Production Build

```
npm run build
npm run preview
```

Desktop Lighthouse Score

| Metric         |   Score |
| -------------- | ------: |
| Performance    |  **96** |
| Accessibility  |  **94** |
| Best Practices | **100** |
| SEO            |  **92** |

> Lighthouse should always be evaluated using the production build (`npm run build` + `npm run preview`), not the development server.

---

# 📦 Bundle Analysis

The application uses:

* Vite Production Build
* Route Based Code Splitting
* Dynamic Imports
* Lazy Components
* Tree Shaking
* Production Optimizations

Result

* Optimized Initial Bundle
* Faster First Paint
* Improved Time to Interactive
* Reduced JavaScript Execution Time

---

# 🛠 Tech Stack

* React 18
* JavaScript
* Vite
* Redux Toolkit
* RTK Query
* Redux Persist
* React Router
* Tailwind CSS
* JSON Server
* ESLint
* Prettier

---

# ▶️ Installation

```bash
git clone <repository-url>

cd ecommerce-dashboard

npm install

npm run dev
```

For Lighthouse testing:

```bash
npm run build

npm run preview
```

---

# 👨‍💻 Author

**Mohan**

Frontend Developer

React • Redux Toolkit • RTK Query • JavaScript • Tailwind CSS
