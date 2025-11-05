'use client';

import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

interface CartItem {
  id: string;
  quantity: number;
  products: {
    id: string;
    name: string;
    price: number;
  };
}

interface CartViewTrackerProps {
  items: CartItem[];
}

export default function CartViewTracker({ items }: CartViewTrackerProps) {
  const posthog = usePostHog();

  useEffect(() => {
    const total = items.reduce(
      (sum, item) => sum + item.products.price * item.quantity,
      0
    );

    posthog.capture('cart_viewed', {
      cart_total: total,
      item_count: items.reduce((sum, item) => sum + item.quantity, 0),
      unique_items: items.length,
      product_ids: items.map(item => item.products.id),
    });
  }, [posthog, items]);

  return null;
}
