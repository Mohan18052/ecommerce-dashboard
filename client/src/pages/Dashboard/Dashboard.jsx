import { useState, useRef } from "react";
import { useSelector } from "react-redux";

import Navbar from "../../components/Navbar/Navbar";
import ProductCard from "../../components/ProductCard/ProductCard";
import Loader from "../../components/Loader/Loader"; 
import VirtualizedList from "../../components/VirtualizedList/VirtualizedList"; // Added VirtualizedList import

import {
  useGetProductsQuery,
} from "../../features/products/productsApi";

import useInfiniteScroll from "../../hooks/useInfiniteScroll";

function Dashboard() {
  const user = useSelector(
    (state) => state.root.auth.user
  );

  const {
    data = [],
    isLoading,
    error,
  } = useGetProductsQuery();

  const [visibleCount, setVisibleCount] =
    useState(8);

  const loaderRef = useRef(null);

  useInfiniteScroll(
    loaderRef,
    () => {
      if (
        visibleCount < data.length
      ) {
        setVisibleCount(
          (prev) => prev + 8
        );
      }
    }
  );

  // Updated isLoading block
  if (isLoading) {
    return (
      <>
        <Navbar />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {[...Array(8)].map(
            (_, index) => (
              <Loader key={index} />
            )
          )}
        </div>
      </>
    );
  }

  // Updated error block with Retry button
  if (error) {
    return (
      <div>
        <h2>
          Error Loading Products
        </h2>

        <button
          onClick={() =>
            window.location.reload()
          }
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <h1>
        Welcome {user?.name}
      </h1>

      {/* Replaced standard flex box layout wrapper with VirtualizedList */}
      <VirtualizedList
        items={data.slice(
          0,
          visibleCount
        )}
        renderItem={(product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        )}
      />

      <div
        ref={loaderRef}
        style={{
          height: "50px",
        }}
      >
        Loading More...
      </div>
    </div>
  );
}

export default Dashboard;