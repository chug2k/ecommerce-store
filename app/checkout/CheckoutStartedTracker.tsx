'use client';

import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

interface CheckoutStartedTrackerProps {
  items: Array<{
    id: string;
    quantity: number;
    products: {
      id: string;
      name: string;
      price: number;
    };
  }>;
  total: number;
}

export default function CheckoutStartedTracker({ items, total }: CheckoutStartedTrackerProps) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture('checkout_started', {
      total: total,
      item_count: items.reduce((sum, item) => sum + item.quantity, 0),
      unique_items: items.length,
      product_ids: items.map(item => item.products.id),
    });
  }, [posthog, items, total]);

  return null;
}
