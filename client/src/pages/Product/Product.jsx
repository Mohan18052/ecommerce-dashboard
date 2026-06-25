import { useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { useAddWishlistItemMutation } from "../../features/wishlist/wishlistApi";
import { useGetProductByIdQuery, useGetProductsQuery } from "../../features/products/productsApi";
import { useAddRecentlyViewedMutation } from "../../features/recentlyViewed/recentlyViewedApi";
import Navbar from "../../components/Navbar/Navbar";
import StarRating from "../../components/StarRating/StarRating";
import ProductCard from "../../components/ProductCard/ProductCard";

function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [addWishlistItem] = useAddWishlistItemMutation();
  const [addRecentlyViewed] = useAddRecentlyViewedMutation();

  const { data, isLoading, error } = useGetProductByIdQuery(id, { skip: !id });
  const { data: allProducts = [] } = useGetProductsQuery();

  // Track recently viewed
  useEffect(() => {
    if (data) {
      addRecentlyViewed(data);
      document.title = `${data.title} — ShopZone`;
    }
  }, [data, addRecentlyViewed]);

  // Related products — same category, exclude current
  const relatedProducts = useMemo(() => {
    if (!data || !allProducts.length) return [];
    return allProducts
      .filter((p) => p.category === data.category && p.id !== data.id)
      .slice(0, 4);
  }, [allProducts, data]);

  const handleAddToCart = useCallback(() => {
    dispatch(addToCart(data));
  }, [dispatch, data]);

  const handleAddToWishlist = useCallback(() => {
    addWishlistItem(data);
  }, [addWishlistItem, data]);

  const handleGoBack = useCallback(() => {
    navigate("/products");
  }, [navigate]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square rounded-2xl skeleton-shimmer" />
            <div className="space-y-4">
              <div className="h-4 w-20 rounded skeleton-shimmer" />
              <div className="h-8 w-3/4 rounded skeleton-shimmer" />
              <div className="h-4 w-32 rounded skeleton-shimmer" />
              <div className="h-4 w-40 rounded skeleton-shimmer" />
              <div className="h-10 w-36 rounded skeleton-shimmer mt-4" />
              <div className="h-16 w-full rounded skeleton-shimmer mt-4" />
              <div className="flex gap-3 mt-6">
                <div className="h-12 flex-1 rounded-lg skeleton-shimmer" />
                <div className="h-12 flex-1 rounded-lg skeleton-shimmer" />
              </div>
            </div>
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
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            The product you're looking for doesn't exist.
          </p>
          <button
            onClick={handleGoBack}
            className="bg-primary hover:bg-primary-light text-white font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            ← Back to Products
          </button>
        </div>
      </>
    );
  }

  if (!data) return null;

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <button
            onClick={() => navigate("/")}
            className="hover:text-text-link dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={handleGoBack}
            className="hover:text-text-link dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            Products
          </button>
          <span>/</span>
          <span className="text-gray-900 dark:text-white font-medium truncate">
            {data.title}
          </span>
        </nav>

        {/* Product Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="relative">
              <img
                src={data.image}
                alt={data.title}
                loading="lazy"
                className="w-full aspect-square object-cover"
              />
              {data.featured && (
                <span className="absolute top-4 left-4 bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center space-y-5 lg:space-y-6 lg:pl-2">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3.5 py-1.5 rounded-full mb-3">
                {data.category}
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                {data.title}
              </h1>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              by{" "}
              <span className="text-text-link dark:text-blue-400 font-semibold">
                {data.brand}
              </span>
            </p>

            <StarRating rating={data.rating} reviews={data.reviews} />

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg text-gray-500 font-medium">₹</span>
                <span className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
                  {data.price?.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Inclusive of all taxes
              </p>
            </div>

            <div className="flex items-center gap-2">
              {data.stock > 10 ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium text-success">
                    In Stock ({data.stock} available)
                  </span>
                </>
              ) : data.stock > 0 ? (
                <>
                  <span className="w-2 h-2 bg-amber-500 rounded-full" />
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    Only {data.stock} left — Order soon!
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm font-medium text-red-500">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            <div className="pt-2">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2.5">
                About this product
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                {data.description}
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={data.stock === 0}
                className="flex-1 bg-amber-400 hover:bg-amber-500 text-gray-900 font-extrabold py-4 rounded-xl transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-base cursor-pointer"
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className="flex-1 bg-rose-50 dark:bg-rose-900/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 font-extrabold py-4 rounded-xl border-2 border-rose-200 dark:border-rose-800 transition-all hover:shadow-xl hover:-translate-y-0.5 text-base cursor-pointer"
              >
                ❤️ Add to Wishlist
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              📦 Related Products in {data.category}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default Product;