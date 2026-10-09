import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { cacheLife } from "next/cache";

interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface ProductDetails {
  id: number;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  change: { dir: string; pct: number };
  markets: Market[];
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

const CHANGE_STYLES = {
  up: { arrow: "▲", colors: "text-red-700" },
  down: { arrow: "▼", colors: "text-green-700" },
  flat: { arrow: "—", colors: "text-gray-600" },
};

const toBanglaNumber = (value: number) => Number(value).toLocaleString("bn-BD");

const toBanglaPrice = (value: number) =>
  Number(value).toLocaleString("bn-BD", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });

const toBanglaPercent = (value: number) =>
  Number(value).toLocaleString("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const getAveragePrice = (lowest: number, highest: number) => (lowest + highest) / 2;

const getProduct = async (id: string): Promise<ProductDetails | null> => {
  "use cache";
  cacheLife("hours");

  const response = await fetch(
    `https://api.abcz.workers.dev/api/bazardor/products/${encodeURIComponent(id)}`
  );

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Product fetch failed: ${response.status}`);

  return response.json();
};

const ChangeSentence = ({ direction, percent }: { direction: string; percent: number }) => {
  if (direction === "up") {
    return (
      <>
        গতকালের তুলনায় আজ দাম <strong className="text-gray-900">বেড়েছে</strong>{" "}
        {toBanglaPercent(percent)}%
      </>
    );
  }

  if (direction === "down") {
    return (
      <>
        গতকালের তুলনায় আজ দাম <strong className="text-gray-900">কমেছে</strong>{" "}
        {toBanglaPercent(percent)}%
      </>
    );
  }

  return <>গতকালের তুলনায় আজ দাম অপরিবর্তিত</>;
};

const SummaryCard = ({
  label,
  price,
  note,
  priceColor,
}: {
  label: string;
  price: number;
  note: string;
  priceColor: string;
}) => (
  <div className="rounded-2xl border border-gray-200 bg-[#FAFCFA] px-6 py-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`mt-1 font-notosans ${priceColor}`}>
      <span className="text-3xl font-bold">{toBanglaPrice(price)}</span> টাকা
    </p>
    <p className="mt-1 text-sm text-gray-500">{note}</p>
  </div>
);

const ProductDetailsContent = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  const direction = product.change?.dir ?? "flat";
  const percent = Math.abs(product.change?.pct ?? 0);
  const changeStyle =
    direction === "up"
      ? CHANGE_STYLES.up
      : direction === "down"
        ? CHANGE_STYLES.down
        : CHANGE_STYLES.flat;

  const unitLabel = UNIT_LABELS[product.unit] ?? product.unit;
  const markets = product.markets ?? [];

  const lowestPrice = Math.min(...markets.map((market) => market.min));
  const highestPrice = Math.max(...markets.map((market) => market.max));
  const averagePrice = getAveragePrice(lowestPrice, highestPrice);

  const marketRows = markets
    .map((market) => ({
      ...market,
      average: getAveragePrice(market.min, market.max),
    }))
    .sort((a, b) => a.average - b.average);

  return (
    <div className="container mx-auto px-4 py-6">
      <nav className="mb-6 flex items-center gap-2 text-gray-600">
        <Link href="/" className="hover:text-green-700">
          হোম
        </Link>
        <span className="text-gray-400">›</span>
        <Link href={`/category/${product.category}`} className="hover:text-green-700">
          {product.categoryNameBn}
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-900">{product.nameBn}</span>
      </nav>

      <section className="rounded-2xl border border-gray-200 bg-[#FAFCFA] p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-5xl">
              {product.image}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{product.nameBn}</h1>
              <p className="text-gray-500">
                প্রতি {unitLabel} · {product.categoryNameBn}
              </p>
              <p className="mt-2 text-gray-600">
                <ChangeSentence direction={direction} percent={percent} />
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-gray-100 px-8 py-4 text-center">
            <p className="text-gray-600">আজকের দাম</p>
            <p className="font-notosans text-5xl font-bold text-gray-900">
              {toBanglaNumber(product.today)}
            </p>
            <p className="text-gray-600">টাকা / {unitLabel}</p>
            <p
              className={`mt-1 inline-flex items-center gap-1.5 text-[17px] font-semibold font-[family-name:var(--font-noto-bengali)] ${changeStyle.colors}`}
            >
              <span className="text-[10px]">{changeStyle.arrow}</span>
              {toBanglaPercent(percent)}%
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-gray-200 bg-[#FAFCFA] p-6">
        <h2 className="text-2xl font-bold text-gray-900">দামের সারসংক্ষেপ</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryCard
            label="সর্বনিম্ন দাম"
            price={lowestPrice}
            note="সবচেয়ে কম দামের বাজার"
            priceColor="text-green-700"
          />
          <SummaryCard
            label="সর্বাধিক দাম"
            price={highestPrice}
            note="সবচেয়ে বেশি দামের বাজার"
            priceColor="text-red-600"
          />
          <SummaryCard
            label="গড় দাম"
            price={averagePrice}
            note={`প্রতি ${unitLabel}-এর হিসাবে`}
            priceColor="text-green-700"
          />
        </div>

        <h2 className="mb-4 mt-8 text-2xl font-bold text-gray-900">
          বাজারভিত্তিক আজকের দাম
        </h2>

        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="px-5 py-3 font-medium">বাজার</th>
                <th className="px-5 py-3 font-medium">বিভাগ</th>
                <th className="px-5 py-3 text-right font-medium">সর্বনিম্ন</th>
                <th className="px-5 py-3 text-right font-medium">সর্বাধিক</th>
                <th className="px-5 py-3 text-right font-medium">গড়</th>
              </tr>
            </thead>
            <tbody>
              {marketRows.map((row) => (
                <tr key={row.market} className="even:bg-[#F3F7F3]">
                  <td className="px-5 py-3 text-gray-900">{row.market}</td>
                  <td className="px-5 py-3 text-gray-500">{row.division}</td>
                  <td className="px-5 py-3 text-right font-notosans text-gray-700">
                    {toBanglaPrice(row.min)} টাকা
                  </td>
                  <td className="px-5 py-3 text-right font-notosans text-gray-700">
                    {toBanglaPrice(row.max)} টাকা
                  </td>
                  <td className="px-5 py-3 text-right font-notosans font-bold text-gray-900">
                    {toBanglaPrice(row.average)} টাকা
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Link
        href={`/category/${product.category}`}
        className="mt-6 inline-flex items-center gap-2 font-semibold text-gray-900 hover:text-green-700"
      >
        <span>{product.categoryIcon}</span>
        সব {product.categoryNameBn}
      </Link>
    </div>
  );
};

const ProductDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  return (
    <Suspense
      fallback={
        <p className="container mx-auto px-4 py-10 text-gray-500">লোড হচ্ছে...</p>
      }
    >
      <ProductDetailsContent params={params} />
    </Suspense>
  );
};

export default ProductDetailsPage;