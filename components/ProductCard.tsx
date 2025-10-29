import Link from 'next/link';
import { Product } from '@/lib/db';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const isLowStock = product.inventory < 30;
  const isOutOfStock = product.inventory === 0;
  
  // Get the primary image or first image from array, or use placeholder
  const getProductImage = () => {
    // First priority: primary_image_url from database
    if (product.image_urls) {
      return product.image_urls;
    }
    
    // Second priority: first image from image_urls array
    if (Array.isArray(product.image_urls) && (product.image_urls as string[]).length > 0) {
      return product.image_urls[0];
    }
    
    // Fallback: placeholder image
    return `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(product.name)}`;
  };

  const imageUrl = getProductImage();

  const cardContent = (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-xl ${isOutOfStock ? "opacity-50" : "opacity-100"} transition-shadow duration-300 overflow-hidden ${isOutOfStock ? 'cursor-not-allowed' : 'cursor-pointer'} h-full flex flex-col`}>
      {/* Product Image */}
      <div className="relative h-48 bg-white-200">
        <img
          src={imageUrl[0]}
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback if Cloudinary image fails to load
            e.currentTarget.src = `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(product.name)}`;
          }}
        />
        
        {/* Show image count badge if multiple images */}
        {product.image_urls && product.image_urls.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
            +{product.image_urls.length - 1} more
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-bold text-blue-600">
            ₹{Number(product.price).toFixed(2)}
          </span>

          <div className="text-right">
            <p
              className={`text-sm font-medium ${
                isLowStock || isOutOfStock ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
            </p>
            <p className="text-xs text-gray-500">
              {product.inventory} units
            </p>
          </div>
        </div>

        <div className="mt-2">
          <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-semibold text-gray-700">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );

  return isOutOfStock ? cardContent : <Link href={`/products/${product.slug}`}>{cardContent}</Link>;
}
