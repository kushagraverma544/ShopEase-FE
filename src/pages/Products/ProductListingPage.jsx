import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ErrorState } from '../../components/common/ErrorState/ErrorState';
import { Pagination } from '../../components/common/Pagination/Pagination';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
import { ProductCardSkeleton } from '../../components/product/ProductCard/ProductCardSkeleton';
import { PRODUCTS_PAGE_SIZE } from '../../constants/product.constants';
import { getProducts, getProductsByCategory } from '../../services/productService';
import { formatSlug } from '../../utils/formatSlug';

export function ProductListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category');
  const page = Number(searchParams.get('page') ?? 1);
  const offset = (page - 1) * PRODUCTS_PAGE_SIZE;

  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('loading');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    // Re-fetching on category/page change (data-fetch-on-prop-change is the
    // documented React pattern here) — reset to loading so the skeleton
    // shows again instead of leaving stale results on screen mid-fetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus('loading');

    const request = category
      ? getProductsByCategory(category, { limit: PRODUCTS_PAGE_SIZE, offset })
      : getProducts({ limit: PRODUCTS_PAGE_SIZE, offset });

    request
      .then((data) => {
        if (!isMounted) return;
        setResult(data);
        setStatus('success');
      })
      .catch(() => {
        if (isMounted) setStatus('error');
      });

    return () => {
      isMounted = false;
    };
  }, [category, offset, retryKey]);

  function goToPage(nextPage) {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('page', String(nextPage));
    setSearchParams(nextParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const title = category ? formatSlug(category) : 'All Products';
  const products = result?.content ?? [];

  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-neutral-800">{title}</h1>

      {status === 'error' ? (
        <ErrorState
          message="Couldn't load products right now."
          onRetry={() => setRetryKey((key) => key + 1)}
        />
      ) : null}

      {status === 'success' && products.length === 0 ? (
        <p className="text-sm text-neutral-500">No products found.</p>
      ) : null}

      {status === 'loading' || (status === 'success' && products.length > 0) ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {status === 'loading'
              ? Array.from({ length: PRODUCTS_PAGE_SIZE }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))
              : products.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>

          {status === 'success' ? (
            <Pagination
              currentPage={page}
              totalPages={result.totalPages}
              onPageChange={goToPage}
              className="mt-8"
            />
          ) : null}
        </>
      ) : null}
    </section>
  );
}

export default ProductListingPage;
