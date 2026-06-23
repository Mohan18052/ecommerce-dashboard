import { useState, useMemo } from "react";

import Navbar from "../../components/Navbar/Navbar";
import ProductCard from "../../components/ProductCard/ProductCard";
import Pagination from "../../components/Pagination/Pagination";
import Loader from "../../components/Loader/Loader"; 

import {
  useGetProductsQuery,
} from "../../features/products/productsApi";

import useDebounce from "../../hooks/useDebounce";
import usePagination from "../../hooks/usePagination";

function Products() {
  // Updated query invocation with a 30-second polling interval
  const {
    data,
    isLoading,
    error,
  } = useGetProductsQuery(undefined, {
    pollingInterval: 30000,
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState("All");

  const [sort, setSort] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const itemsPerPage = 8;

  const debouncedSearch =
    useDebounce(search, 300);

  const filteredProducts = useMemo(() => {
    if (!data) return [];

    let products = [...data];

    if (debouncedSearch) {
      products = products.filter((product) =>
        product.title
          .toLowerCase()
          .includes(
            debouncedSearch.toLowerCase()
          )
      );
    }

    if (category !== "All") {
      products = products.filter(
        (product) =>
          product.category === category
      );
    }

    if (sort === "low-high") {
      products.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "high-low") {
      products.sort(
        (a, b) => b.price - a.price
      );
    }

    return products;
  }, [
    data,
    debouncedSearch,
    category,
    sort,
  ]);

  const paginatedProducts =
    usePagination(
      filteredProducts,
      currentPage,
      itemsPerPage
    );

  const totalPages = Math.ceil(
    filteredProducts.length /
      itemsPerPage
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

  const categories = [
    "All",
    ...new Set(
      data?.map(
        (product) => product.category
      )
    ),
  ];

  return (
    <>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <h1>Products</h1>

        <input
          type="text"
          placeholder="Search Product..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <br />
        <br />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          {categories.map((cat) => (
            <option
              key={cat}
              value={cat}
            >
              {cat}
            </option>
          ))}
        </select>

        <br />
        <br />

        <select
          value={sort}
          onChange={(e) =>
            setSort(e.target.value)
          }
        >
          <option value="">
            Sort By
          </option>

          <option value="low-high">
            Price Low → High
          </option>

          <option value="high-low">
            Price High → Low
          </option>
        </select>

        <br />
        <br />

        {/* Added No Products Found fallback alert */}
        {filteredProducts.length === 0 && (
          <div>
            <h2>No Products Found</h2>
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {paginatedProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={
            setCurrentPage
          }
        />
      </div>
    </>
  );
}

export default Products;