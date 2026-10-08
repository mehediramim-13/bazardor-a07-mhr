import Link from "next/link";
import { cacheLife } from "next/cache";

interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
};

const Nav = async () => {
  "use cache";
  cacheLife("hours");

  const res = await fetch(
    "https://api.api-store.workers.dev/api/bazardor/categories"
  );

  if (!res.ok) return null;

  const categories: Category[] = await res.json();

  return (
    <nav className="border-b border-gray-200 bg-[#FAFCFA]">
      <div className="container mx-auto flex items-center gap-8 overflow-x-auto px-4 whitespace-nowrap">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/category/${c.slug}`}
            className="flex items-center gap-2 py-3 text-sm font-semibold text-gray-800 transition hover:text-green-700"
          >
            <span>{c.icon}</span>
            <span>{c.nameBn}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Nav;