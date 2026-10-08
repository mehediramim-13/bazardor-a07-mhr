import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";
import AllProducts, {type Product} from "@/app/components/products/AllProductsCard";

type CategoryProduct = Product & {
  categoryNameBn: string;
  categoryIcon: string;
};

const getProducts = async (slug: string): Promise<CategoryProduct[]> => {
  "use cache";
  cacheLife("hours");

  const res = await fetch(
    `https://api.abcz.workers.dev/api/bazardor/products?category=${encodeURIComponent(slug)}`
  );
  if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`);
  return res.json();
};

const CategoryContent = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const products = await getProducts(slug);

  if (products.length === 0) notFound();

  const { categoryNameBn, categoryIcon } = products[0];
  const count = products.length.toLocaleString("bn-BD");

  return (
    <>
      <section className="container mx-auto px-4 pt-6">
        <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-[#FAFCFA] p-6">
          <span className="text-5xl">{categoryIcon}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{categoryNameBn}</h1>
            <p className="text-gray-600">{count}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
          </div>
        </div>
      </section>

      <AllProducts products={products} showTitle={false} />
    </>
  );
};

const CategoryPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  return (
    <Suspense
      fallback={<p className="container mx-auto px-4 py-10 text-gray-500">লোড হচ্ছে...</p>}
    >
      <CategoryContent params={params} />
    </Suspense>
  );
};

export default CategoryPage;