import Link from "next/link";

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex justify-end h-20">
          <div className="flex items-center space-x-1">
            <Link
              href="/"
              className="rounded-full px-6 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all"
            >
              Feed
            </Link>
            <Link
              href="/trending"
              className="rounded-full px-6 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all"
            >
              Trending
            </Link>
            <Link
              href="/top-users"
              className="rounded-full px-6 py-2 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all ml-2"
            >
              Top Users
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
