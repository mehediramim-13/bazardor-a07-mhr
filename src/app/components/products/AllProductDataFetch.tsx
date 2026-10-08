import { cacheLife } from "next/cache";
import AllProducts, { type Product } from "./AllProducts";

const AllProductsDataFetch = async () => {
  "use cache";
  cacheLife("hours");

  const res = await fetch(
    "https://api.abcz.workers.dev/api/bazardor/products"
  );

  if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`);

  const data: Product[] = await res.json();

  return <AllProducts products={data} />;
};

export default AllProductsDataFetch;