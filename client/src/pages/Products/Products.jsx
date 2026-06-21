import Navbar from "../../components/Navbar/Navbar";
import ProductCard from "../../components/ProductCard/ProductCard";

import {
  useGetProductsQuery,
} from "../../features/products/productsApi";

function Products() {
  const {
    data,
    isLoading,
    error,
  } = useGetProductsQuery();

  if (isLoading) {
    return <h2>Loading Products...</h2>;
  }

  if (error) {
    return <h2>Error Loading Products</h2>;
  }

  return (
    <>
      <Navbar />

      <div>
        <h1>Products</h1>

        {data?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </>
  );
}

export default Products;