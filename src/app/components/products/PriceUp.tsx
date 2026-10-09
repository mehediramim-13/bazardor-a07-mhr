"use cache";
import Link from "next/link";

interface Product {
  id: number;
  nameBn: string;
  unit: string;
  image: string;
  today: number;
  change: { dir: "up" | "down"; pct: number };
}

const UNIT_LABELS: Record<string, string> = {
  kg: "কেজি",
  dozen: "ডজন",
  litre: "লিটার",
  liter: "লিটার",
  piece: "পিস",
  pcs: "পিস",
  gram: "গ্রাম",
};

const toBanglaNumber = (value: number) => Number(value).toLocaleString("bn-BD");

const toBanglaPercent = (value: number) =>
  Number(value).toLocaleString("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const PriceUp = async () => {
  const response = await fetch(
    "https://api.abcz.workers.dev/api/bazardor/products"
  );

  if (!response.ok) throw new Error(`Products fetch failed: ${response.status}`);

  const products: Product[] = await response.json();

  const risenProducts = products
    .filter((product) => product.change?.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  return (
    <section className="container mx-auto px-4 py-6">
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
        <span className="text-lg text-red-600">▲</span>
        আজ দাম বেড়েছে
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {risenProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product-details/${product.id}`}
            className="block rounded-2xl border border-gray-200 bg-[#FAFCFA] p-4 transition hover:border-green-600 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                {product.image}
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight text-gray-900">
                  {product.nameBn}
                </h3>
                <p className="text-xs text-gray-500">
                  প্রতি {UNIT_LABELS[product.unit] ?? product.unit}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">আজকের দাম</p>
            <div className="flex items-center justify-between">
              <p className="text-gray-900">
                <span className="text-xl font-bold">
                  {toBanglaNumber(product.today)}
                </span>{" "}
                টাকা
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-[15px] font-medium text-red-700 font-notosans">
                <span className="text-[10px]">▲</span>
                {toBanglaPercent(product.change.pct)}%
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default PriceUp;