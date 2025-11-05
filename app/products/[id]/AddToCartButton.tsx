'use client';

import { useState } from 'react';

export default function AddToCartButton({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');

  const addToCart = async () => {
    if (product.stock === 0) return;

    setIsAdding(true);
    setMessage('');

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          quantity,
        }),
      });

      if (response.ok) {
        setMessage('Added to cart!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to add to cart');
      }
    } catch (error) {
      setMessage('Error adding to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="quantity" className="font-medium">
          Quantity:
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2"
          disabled={product.stock === 0}
        >
          {Array.from(
            { length: Math.min(product.stock, 10) },
            (_, i) => i + 1
          ).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={addToCart}
        disabled={product.stock === 0 || isAdding}
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>

      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.includes('Error') || message.includes('Failed')
              ? 'text-red-600'
              : 'text-green-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
