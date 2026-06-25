import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import Pagination from "../../components/Pagination/Pagination";
import StarRating from "../../components/StarRating/StarRating";
import { addToCart } from "../../features/cart/cartSlice";
import {
  useGetWishlistQuery,
  useRemoveWishlistItemMutation,
} from "../../features/wishlist/wishlistApi";

function Wishlist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: wishlistItems = [], isLoading } = useGetWishlistQuery();
  const [removeWishlistItem] = useRemoveWishlistItemMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [localItems, setLocalItems] = useState([]);

  useEffect(() => { document.title = `Wishlist (${wishlistItems.length}) — ShopZone`; }, [wishlistItems.length]);
  useEffect(() => { setLocalItems(wishlistItems); }, [wishlistItems]);

  const totalPages = Math.ceil(localItems.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return localItems.slice(start, start + itemsPerPage);
  }, [localItems, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const handleRemove = useCallback((id) => removeWishlistItem(id), [removeWishlistItem]);
  const handleMoveToCart = useCallback((item) => {
    dispatch(addToCart(item));
    removeWishlistItem(item.id);
  }, [dispatch, removeWishlistItem]);

  const handleDragStart = useCallback((e, index) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }, []);
  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  }, []);
  const handleDrop = useCallback((e, toIndex) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === toIndex) return;
    const items = [...localItems];
    const [moved] = items.splice(dragIndex, 1);
    items.splice(toIndex, 0, moved);
    setLocalItems(items);
    setDragIndex(null);
    setDragOverIndex(null);
  }, [dragIndex, localItems]);
  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setDragOverIndex(null);
  }, []);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-64 rounded-xl skeleton-shimmer" />
            ))}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">My Wishlist</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {localItems.length} item{localItems.length !== 1 ? "s" : ""} saved · Drag to reorder
            </p>
          </div>
        </div>

        {localItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">❤️</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Save products you love to your wishlist</p>
            <button onClick={() => navigate("/products")}
              className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer">
              Browse Products
            </button>
          </div>
        ) : (
          <>
            {/* ── Same grid as Products page: 6 cols ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {paginatedItems.map((item, idx) => {
                const globalIdx = (currentPage - 1) * itemsPerPage + idx;
                const isDragging = dragIndex === globalIdx;
                const isDragOver = dragOverIndex === globalIdx;
                return (
                  <div
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, globalIdx)}
                    onDragOver={(e) => handleDragOver(e, globalIdx)}
                    onDrop={(e) => handleDrop(e, globalIdx)}
                    onDragEnd={handleDragEnd}
                    className={`group bg-white dark:bg-gray-800 rounded-2xl border overflow-hidden shadow-sm hover:shadow-xl hover:shadow-amber-100/40 dark:hover:shadow-amber-900/20 transition-all duration-300 hover:-translate-y-1 flex flex-col ${
                      isDragging ? "opacity-40 scale-95" : ""
                    } ${isDragOver ? "border-accent border-2 ring-2 ring-accent/20" : "border-gray-100 dark:border-gray-700/50"}`}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-square flex-shrink-0 cursor-pointer"
                      onClick={() => navigate(`/products/${item.id}`)}>
                      <img src={item.image} alt={item.title} loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />

                      {/* Drag handle */}
                      <div className="absolute top-2 left-2 w-7 h-7 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 cursor-grab active:cursor-grabbing shadow text-xs font-bold">
                        ⠿
                      </div>

                      {/* Remove btn */}
                      <button onClick={(e) => { e.stopPropagation(); handleRemove(item.id); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow cursor-pointer text-xs font-bold">
                        ✕
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-3 gap-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 truncate">
                        {item.category}
                      </span>
                      <h3 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                        onClick={() => navigate(`/products/${item.id}`)}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        by <span className="font-medium text-blue-600 dark:text-blue-400">{item.brand || "Unknown"}</span>
                      </p>
                      {item.rating && <StarRating rating={item.rating} reviews={item.reviews || 0} />}

                      <div className="mt-auto pt-1 flex items-baseline gap-0.5">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">₹</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                          {item.price?.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <button onClick={() => handleMoveToCart(item)}
                        className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black text-[11px] font-bold py-2 rounded-xl transition-all mt-1 cursor-pointer active:scale-95 truncate">
                        🛒 Move to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
          </>
        )}
      </main>
    </>
  );
}

export default Wishlist;