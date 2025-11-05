import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';
import CheckoutForm from './CheckoutForm';
import { redirect } from 'next/navigation';

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

export default async function CheckoutPage() {
  const items = await getCartItems();

  if (items.length === 0) {
    redirect('/cart');
  }

  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.products.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <CheckoutForm total={total} />
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-4 mb-6">
              {items.map((item: any) => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.products.image_url}
                    alt={item.products.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.products.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${(item.products.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 border-t border-gray-200 pt-4">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
