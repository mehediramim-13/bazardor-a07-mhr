"use cache";
import MarqueeText from "react-marquee-text";

type Product = {
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

const pickItems = (products: Product[]) => {
  const up = products
    .filter((p) => p.change?.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct);

  const down = products
    .filter((p) => p.change?.dir === "down")
    .sort((a, b) => a.change.pct - b.change.pct);

  let result = [...up.slice(0, 6), ...down.slice(0, 6)];

  if (result.length < 11) {
    const rest = [...up.slice(6), ...down.slice(5)];
    result = [...result, ...rest.slice(0, 11 - result.length)];
  }

  return result.slice(0, 11);
};

const Marquee = async () => {
  const res = await fetch(
    "https://api.abcz.workers.dev/api/bazardor/products"
  );
  const data: Product[] = await res.json();
  const items = pickItems(data);

  return (
    <div className="border-b border-gray-200 py-2 bg-[#FAFCFA]">
      <MarqueeText
     duration={10}
     pauseOnHover={true}
    direction="right"
>
        {items.map((p) => {
          const isUp = p.change.dir === "up";
          return (
            <span
              key={p.id}
              className="inline-flex items-center gap-2 px-6 whitespace-nowrap border-r border-gray-300"
            >
              <span>{p.image}</span>
              <span className="font-semibold">{p.nameBn}</span>
              <span className="text-sm text-gray-500">
                {bn(p.today)} টাকা/{UNIT_BN[p.unit] ?? p.unit}
              </span>
              <span
                className={`text-sm font-semibold ${
                  isUp ? "text-red-600" : "text-green-600"
                }`}
              >
                {isUp ? "▲" : "▼"} {bn(p.change.pct)}%
              </span>
            </span>
          );
        })}
      </MarqueeText>
    </div>
  );
};

export default Marquee;