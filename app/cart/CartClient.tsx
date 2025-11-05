'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type CartItem = {
  id: number;
  quantity: number;
  products: {
    id: number;
    name: string;
    price: number;
    image_url: string;
    stock: number;
  };
};

export default function CartClient({
  initialItems,
}: {
  initialItems: CartItem[];
}) {
  const [items, setItems] = useState(initialItems);
  const router = useRouter();

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_item_id: cartItemId, quantity: newQuantity }),
      });

      if (response.ok) {
        if (newQuantity <= 0) {
          setItems(items.filter((item) => item.id !== cartItemId));
        } else {
          setItems(
            items.map((item) =>
              item.id === cartItemId ? { ...item, quantity: newQuantity } : item
            )
          );
        }
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      const response = await fetch(`/api/cart?id=${cartItemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems(items.filter((item) => item.id !== cartItemId));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.products.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
          {items.map((item) => (
            <div key={item.id} className="p-6 flex gap-4">
              <img
                src={item.products.image_url}
                alt={item.products.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.products.name}
                </h3>
                <p className="text-gray-700 mt-1">
                  ${item.products.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <span className="px-4 py-1 border-x border-gray-300">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.products.stock}
                      className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  ${(item.products.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Order Summary
          </h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <a
            href="/checkout"
            className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Proceed to Checkout
          </a>
          <a
            href="/"
            className="block w-full text-center text-blue-600 hover:text-blue-800 mt-4"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
}
