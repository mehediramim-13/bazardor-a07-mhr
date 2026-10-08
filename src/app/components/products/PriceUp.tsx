"use cache";

interface Product  {
  id: number;
  nameBn: string;
  unit: string;
  image: string;
  today: number;
  change: { dir: "up" | "down"; pct: number };
};

const UNIT_BN: Record<string, string> = {
  kg: "কেজি",
  dozen: "ডজন",
  litre: "লিটার",
  liter: "লিটার",
  piece: "পিস",
  pcs: "পিস",
  gram: "গ্রাম",
};

const bn = (n: number) => Number(n).toLocaleString("bn-BD");

const bnPct = (n: number) =>
  Number(n).toLocaleString("bn-BD", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

const PriceUp = async () => {
  const res = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/products"
  );
  const data: Product[] = await res.json();

  const items = data
    .filter((p) => p.change?.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900">
        <span className="text-lg text-red-600">▲</span>
        আজ দাম বেড়েছে
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-gray-200 bg-[#FAFCFA] p-5"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-3xl">
                {p.image}
              </div>
              <div>
                <h3 className="text-xl font-bold leading-tight text-gray-900">
                  {p.nameBn}
                </h3>
                <p className="text-sm text-gray-500">
                  প্রতি {UNIT_BN[p.unit] ?? p.unit}
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500">আজকের দাম</p>
            <div className="flex items-center justify-between">
              <p className="text-gray-900">
                <span className="text-2xl font-bold">{bn(p.today)}</span> টাকা
              </p>
              <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
                ▲ {bnPct(p.change.pct)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PriceUp;