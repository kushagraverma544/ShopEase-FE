import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Loader } from '../../components/common/Loader/Loader';
import { Pagination } from '../../components/common/Pagination/Pagination';
import { ProductCard } from '../../components/product/ProductCard/ProductCard';
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

  useEffect(() => {
    let isMounted = true;

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
  }, [category, offset]);

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

      {status === 'loading' ? <Loader fullScreen /> : null}

      {status === 'error' ? (
        <p className="rounded-md bg-danger-50 px-4 py-3 text-sm text-danger-600">
          Couldn&apos;t load products right now. Please try again later.
        </p>
      ) : null}

      {status === 'success' && products.length === 0 ? (
        <p className="text-sm text-neutral-500">No products found.</p>
      ) : null}

      {status === 'success' && products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={result.totalPages}
            onPageChange={goToPage}
            className="mt-8"
          />
        </>
      ) : null}
    </section>
  );
}

export default ProductListingPage;
