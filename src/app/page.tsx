import Marquee from "./components/Marquee";
import HeroBanner from "./components/HeroBanner";
import PriceUp from "./components/products/PriceUp";

export default function Home() {
  return (
    <div>
      <Marquee></Marquee>
      <HeroBanner></HeroBanner>
      <PriceUp></PriceUp>
    </div>
  );
}
