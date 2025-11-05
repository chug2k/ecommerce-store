'use client';

import { useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';

interface ProductViewTrackerProps {
  product: {
    id: string;
    name: string;
    price: number;
    categories: {
      name: string;
    };
  };
}

export default function ProductViewTracker({ product }: ProductViewTrackerProps) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.capture('product_viewed', {
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      category: product.categories.name,
    });
  }, [posthog, product]);

  return null;
}
