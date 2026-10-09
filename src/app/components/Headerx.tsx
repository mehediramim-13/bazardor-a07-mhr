import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import TodayDate from "./TodayDate";
import UserMenu from "./UserMenu";

const Header = () => {
  return (
    <header className="border-b border-gray-200 bg-[#FAFCFA]">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/icon-512.png" alt="logo" width={40} height={40} priority />
          <div className="leading-tight">
            <span className="block text-lg font-bold">বাজার দর</span>
            <Suspense
              fallback={<span className="block h-4 w-32 animate-pulse rounded bg-gray-200" />}
            >
              <TodayDate />
            </Suspense>
          </div>
        </Link>

        <UserMenu />
      </div>
    </header>
  );
};

export default Header;