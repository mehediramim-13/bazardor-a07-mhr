import { cacheLife } from "next/cache";
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

const splitName = (name: string): [string, string] => {
  const index = name.indexOf("(");
  if (index === -1) return [name, ""];
  return [name.slice(0, index), name.slice(index)];
};

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

async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");

  const res = await fetch("https://api.abcz.workers.dev/api/bazardor/products", {
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) throw new Error(`Products fetch failed: ${res.status}`);

  return res.json();
}

const Marquee = async () => {
  let items: Product[];

  try {
    items = pickItems(await getProducts());
  } catch (error) {
    console.error("Marquee:", error);
    return null;
  }

  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden border-b border-gray-200 bg-[#FAFCFA] py-1.5 text-sm sm:py-2 sm:text-base">
      <MarqueeText duration={10} pauseOnHover={true} direction="right">
        {items.map((p) => {
          const isUp = p.change.dir === "up";
          const [mainName, bracketName] = splitName(p.nameBn);
          return (
            <span
              key={p.id}
              className="inline-flex items-center gap-1.5 whitespace-nowrap border-r border-gray-300 px-4 sm:gap-2 sm:px-6"
            >
              <span>{p.image}</span>
              <span className="font-medium">
                {mainName}
                {bracketName && (
                  <span className="font-notosans">{bracketName}</span>
                )}
              </span>
              <span className="text-xs text-gray-500 sm:text-sm">
                <span className="font-notosans">{bn(p.today)}</span> টাকা/
                {UNIT_BN[p.unit] ?? p.unit}
              </span>
              <span
                className={`text-xs font-medium sm:text-sm ${
                  isUp ? "text-red-600" : "text-green-600"
                }`}
              >
                {isUp ? "▲" : "▼"}{" "}
                <span className="font-notosans">{bn(p.change.pct)}%</span>
              </span>
            </span>
          );
        })}
      </MarqueeText>
    </div>
  );
};

export default Marquee;