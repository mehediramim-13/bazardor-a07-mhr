"use client";

import { useMemo, useState } from "react";

export interface Product {
  id: number;
  nameBn: string;
  unit: string;
  image: string;
  today: number;
  change: { dir: string; pct: number };
}

const UNIT_BN: Record<string, string> = {
  kg: "কেজি",
  dozen: "ডজন",
  litre: "লিটার",
  liter: "লিটার",
  piece: "পিস",
  pcs: "পিস",
  gram: "গ্রাম",
};

const SORT_OPTIONS = [
  { value: "default", label: "ডিফল্ট" },
  { value: "price-asc", label: "দাম কম থেকে বেশি" },
  { value: "price-desc", label: "দাম বেশি থেকে কম" },
  { value: "rise", label: "দাম বেশি বেড়েছে" },
  { value: "fall", label: "দাম বেশি কমেছে" },
];

const bn = (n: number) => Number(n).toLocaleString("bn-BD");

const bnPct = (n: number) =>
  Number(n).toLocaleString("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const signedPct = (p: Product) => {
  const v = Math.abs(p.change?.pct ?? 0);
  if (p.change?.dir === "up") return v;
  if (p.change?.dir === "down") return -v;
  return 0;
};

const Badge = ({ product }: { product: Product }) => {
  const dir = product.change?.dir;
  const pct = Math.abs(product.change?.pct ?? 0);

  if (dir === "up") {
    return (
      <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
        ▲ {bnPct(pct)}%
      </span>
    );
  }

  if (dir === "down") {
    return (
      <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
        ▼ {bnPct(pct)}%
      </span>
    );
  }

  return (
    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
      — {bnPct(pct)}%
    </span>
  );
};

const AllProducts = ({
  products,
  showTitle = true,
}: {
  products: Product[];
  showTitle?: boolean;
}) => {
  const [sort, setSort] = useState("default");

  const items = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case "price-asc":
        return list.sort((a, b) => a.today - b.today);
      case "price-desc":
        return list.sort((a, b) => b.today - a.today);
      case "rise":
        return list.sort((a, b) => signedPct(b) - signedPct(a));
      case "fall":
        return list.sort((a, b) => signedPct(a) - signedPct(b));
      default:
        return list;
    }
  }, [products, sort]);

  return (
    <section id="all-products" className="container mx-auto scroll-mt-6 px-4 py-6">
      {showTitle && (
        <h2 className="text-2xl font-bold text-gray-900">সব পণ্য</h2>
      )}

      <div className="mb-4 mt-3 flex items-center justify-between gap-3">
        <p className="text-gray-600">
          মোট {bn(items.length)}টি পণ্য দেখানো হচ্ছে
        </p>

        <label className="flex items-center gap-2 text-gray-600">
          সাজান
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-green-600"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-gray-200 bg-[#FAFCFA] p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-2xl">
                {p.image}
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight text-gray-900">
                  {p.nameBn}
                </h3>
                <p className="text-xs text-gray-500">
                  প্রতি {UNIT_BN[p.unit] ?? p.unit}
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">আজকের দাম</p>
            <div className="flex items-center justify-between">
              <p className="text-gray-900">
                <span className="text-xl font-bold">{bn(p.today)}</span> টাকা
              </p>
              <Badge product={p} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllProducts;