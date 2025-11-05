import { supabase } from '@/lib/supabase';
import Link from 'next/link';

async function getProducts() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*, categories(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return products;
}

async function getCategories() {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return categories;
}

export default async function Home({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const products = await getProducts();
  const categories = await getCategories();

  const filteredProducts = searchParams.category
    ? products.filter(
        (p: any) => p.categories?.name.toLowerCase() === searchParams.category
      )
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>

      {/* Category Filter */}
      <div className="mb-8 flex gap-2 flex-wrap">
        <Link
          href="/"
          className={`px-4 py-2 rounded-lg ${
            !searchParams.category
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          All
        </Link>
        {categories.map((category: any) => (
          <Link
            key={category.id}
            href={`?category=${category.name.toLowerCase()}`}
            className={`px-4 py-2 rounded-lg ${
              searchParams.category === category.name.toLowerCase()
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product: any) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="aspect-square bg-gray-200 relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {product.categories?.name}
              </p>
              <p className="text-xl font-bold text-gray-900">
                ${product.price.toFixed(2)}
              </p>
              {product.stock < 10 && product.stock > 0 && (
                <p className="text-sm text-orange-600 mt-2">
                  Only {product.stock} left!
                </p>
              )}
              {product.stock === 0 && (
                <p className="text-sm text-red-600 mt-2">Out of stock</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-gray-500 text-center py-12">
          No products found in this category.
        </p>
      )}
    </div>
  );
}
