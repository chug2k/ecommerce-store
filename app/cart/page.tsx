import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import CartClient from './CartClient';

// Disable caching for real-time cart updates
export const revalidate = 0;

async function getCartItems() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('session_id')?.value;

  if (!sessionId) {
    return [];
  }

  const { data: cartItems, error } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('session_id', sessionId);

  if (error) {
    console.error('Error fetching cart:', error);
    return [];
  }

  return cartItems || [];
}

export default async function CartPage() {
  const items = await getCartItems();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <a
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Continue Shopping
          </a>
        </div>
      ) : (
        <CartClient initialItems={items} />
      )}
    </div>
  );
}
