import Link from 'next/link';
import { getAllProducts } from '@/lib/db';
import SearchFilter from '@/components/SearchFilter';

// This tells Next.js to fetch data at BUILD TIME (SSG)
export const revalidate = false;

async function getProducts() {
  const products = await getAllProducts();
  return products;
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-lg lg:text-3xl font-bold text-gray-900">
              Product Catalog
            </h1>
            <nav className="space-x-4">
              <Link href="/" className="text-sm lg:text-lg text-blue-600 hover:text-blue-800">
                Home
              </Link>
              <Link href="/dashboard" className="text-sm lg:text-lg text-blue-600 hover:text-blue-800">
                Dashboard
              </Link>
              <Link href="/admin" className="text-sm lg:text-lg text-blue-600 hover:text-blue-800">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Browse Our Products
          </h2>
          <p className="text-gray-600">
            Showing {products.length} products (Generated at build time - SSG)
          </p>
        </div>

        {/* Search/Filter Component */}
        <SearchFilter products={products} />
      </main>
    </div>
  );
}