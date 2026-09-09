import { useEffect, useState } from 'react';

import { ErrorState } from '../../../components/common/ErrorState/ErrorState';
import { ProductCard } from '../../../components/product/ProductCard/ProductCard';
import { ProductCardSkeleton } from '../../../components/product/ProductCard/ProductCardSkeleton';
import { FEATURED_PRODUCTS_LIMIT } from '../../../constants/product.constants';
import { getProducts } from '../../../services/productService';

export function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset to loading on manual retry
    setStatus('loading');

    getProducts({ limit: FEATURED_PRODUCTS_LIMIT })
      .then((data) => {
        if (!isMounted) return;
        setProducts(data.content ?? []);
        setStatus('success');
      })
      .catch(() => {
        if (isMounted) setStatus('error');
      });
    return () => {
      isMounted = false;
    };
  }, [retryKey]);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="mb-6 text-2xl font-semibold text-neutral-800">Featured Products</h2>

      {status === 'error' ? (
        <ErrorState
          message="Couldn't load featured products right now."
          onRetry={() => setRetryKey((key) => key + 1)}
        />
      ) : null}

      {status === 'loading' || status === 'success' ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {status === 'loading'
            ? Array.from({ length: FEATURED_PRODUCTS_LIMIT }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            : products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : null}
    </section>
  );
}
