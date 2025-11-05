import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';

// Disable caching for real-time stock updates
export const revalidate = 0;

async function getProduct(id: string) {
  const { data: product, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('id', id)
    .single();

  if (error || !product) {
    return null;
  }

  return product;
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Product Details */}
        <div>
          <p className="text-sm text-gray-500 mb-2">{product.categories.name}</p>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-gray-900 mb-6">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Stock Info */}
          <div className="mb-6">
            {product.stock > 10 && (
              <p className="text-green-600 font-medium">In Stock</p>
            )}
            {product.stock > 0 && product.stock <= 10 && (
              <p className="text-orange-600 font-medium">
                Only {product.stock} left in stock!
              </p>
            )}
            {product.stock === 0 && (
              <p className="text-red-600 font-medium">Out of Stock</p>
            )}
          </div>

          {/* Add to Cart */}
          <AddToCartButton product={product} />

          <a
            href="/"
            className="inline-block mt-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to Products
          </a>
        </div>
      </div>
    </div>
  );
}
