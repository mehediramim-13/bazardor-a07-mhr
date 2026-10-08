import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import TodayDate from "./TodayDate";

const HeroBanner = () => {
  return (
    <section className="mx-auto my-10 max-w-7xl px-4">
      <div className="flex flex-col-reverse items-center justify-between gap-8 rounded-[2rem] border border-gray-200 bg-[#fbfdfb] px-6 py-10 md:flex-row md:px-7 md:py-12">
        <div className="max-w-2xl">
          <Suspense
            fallback={
              <span className="inline-block h-8 w-56 rounded-full bg-green-100" />
            }
          >
            <TodayDate className="inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-medium text-green-800" />
          </Suspense>

          <h1 className="mt-3 text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mt-3 text-base leading-relaxed text-gray-600 md:text-lg">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <Link
            href="/products"
            className="mt-6 inline-block rounded-lg bg-green-700 px-5 py-2.5 font-semibold text-white shadow-md transition hover:bg-green-800"
          >
            সব পণ্য দেখুন
          </Link>
        </div>

        <div className="flex w-full justify-center md:w-auto md:pr-16">
          <Image
            src="/bazar-hero.png"
            alt="বাজারের ঝুড়ি"
            width={380}
            height={320}
            priority
            className="h-auto w-64 md:w-[380px]"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;