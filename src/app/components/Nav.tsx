import { Suspense } from "react";
import { cacheLife } from "next/cache";
import NavLinks from "./NavLink";
interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const Nav = async () => {
  "use cache";
  cacheLife("hours");

  const res = await fetch(
    "https://api.abcz.workers.dev/api/bazardor/categories"
  );

  if (!res.ok) return null;

  const categories: Category[] = await res.json();

  return (
    <nav className="border-b border-gray-200 bg-[#FAFCFA]">
      <div className="container mx-auto flex items-center gap-2 overflow-x-auto px-4 whitespace-nowrap">
        <Suspense fallback={null}>
          <NavLinks categories={categories} />
        </Suspense>
      </div>
    </nav>
  );
};

export default Nav;