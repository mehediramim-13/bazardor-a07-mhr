"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

const NavLinks = ({ categories }: { categories: Category[] }) => {
  const pathname = usePathname();

  return (
    <>
      {categories.map((c) => {
        const href = `/category/${c.slug}`;
        const isActive = pathname === href;

        return (
          <Link
            key={c.id}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className={`my-2 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold shadow-sm transition ${
              isActive
                ? "bg-green-700 text-white shadow-md"
                : "text-gray-800 shadow-none hover:bg-gray-100 hover:text-green-700"
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.nameBn}</span>
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;