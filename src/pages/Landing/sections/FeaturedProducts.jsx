import { useEffect, useState } from 'react';

import { Loader } from '../../../components/common/Loader/Loader';
import { ProductCard } from '../../../components/product/ProductCard/ProductCard';
import { getProducts } from '../../../services/productService';

export function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let isMounted = true;
    getProducts({ limit: 8 })
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
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="mb-6 text-2xl font-semibold text-neutral-800">Featured Products</h2>

      {status === 'loading' ? <Loader fullScreen /> : null}

      {status === 'error' ? (
        <p className="rounded-md bg-danger-50 px-4 py-3 text-sm text-danger-600">
          Couldn&apos;t load products right now. Please try again later.
        </p>
      ) : null}

      {status === 'success' ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
