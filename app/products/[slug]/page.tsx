import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug } from "@/lib/db";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | Product Catalog`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const isLowStock = product.inventory < 30;
  const lastUpdated = new Date(product.last_updated).toLocaleString();

  // Simple: get image or placeholder
  const imageUrl = product.image_urls || `https://placehold.co/800x600/3b82f6/ffffff?text=${product.name}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
            ← Back to Products
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div className="relative h-96 bg-white-200 rounded-lg overflow-hidden">
              <img
                src={imageUrl[0]}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col">
              <div className="mb-4">
                <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                  {product.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <p className="text-gray-600 mb-6 text-lg">
                {product.description}
              </p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  ₹{Number(product.price).toFixed(2)}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-medium">Availability:</span>
                  <span className={`font-semibold ${isLowStock ? "text-red-600" : "text-green-600"}`}>
                    {isLowStock ? "⚠️ Low Stock" : "✓ In Stock"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">Units Available:</span>
                  <span className="font-semibold text-gray-900">{product.inventory}</span>
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-4">
                Add to Cart
              </button>

              <div className="border-t pt-4 mt-auto">
                <p className="text-sm text-gray-500">Product ID: {product.id}</p>
                <p className="text-sm text-gray-500">Last Updated: {lastUpdated}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
