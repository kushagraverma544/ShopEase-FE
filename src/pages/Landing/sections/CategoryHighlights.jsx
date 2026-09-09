import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { ErrorState } from '../../../components/common/ErrorState/ErrorState';
import { Skeleton } from '../../../components/common/Skeleton/Skeleton';
import { getCategoryIcon } from '../../../constants/categoryIcons';
import { CATEGORY_HIGHLIGHTS_SKELETON_COUNT } from '../../../constants/product.constants';
import { ROUTE_PATHS } from '../../../routes/routePaths';
import { getCategories } from '../../../services/productService';

const MAX_CATEGORIES = 6;

function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-0 px-3 py-5">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

export function CategoryHighlights() {
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('loading');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset to loading on manual retry
    setStatus('loading');

    getCategories()
      .then((data) => {
        if (!isMounted) return;
        setCategories((data ?? []).slice(0, MAX_CATEGORIES));
        setStatus('success');
      })
      .catch(() => {
        if (isMounted) setStatus('error');
      });
    return () => {
      isMounted = false;
    };
  }, [retryKey]);

  if (status === 'success' && categories.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="mb-6 text-2xl font-semibold text-neutral-800">Shop by Category</h2>

      {status === 'error' ? (
        <ErrorState
          message="Couldn't load categories right now."
          onRetry={() => setRetryKey((key) => key + 1)}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {status === 'loading'
            ? Array.from({ length: CATEGORY_HIGHLIGHTS_SKELETON_COUNT }).map((_, index) => (
                <CategoryCardSkeleton key={index} />
              ))
            : categories.map(({ slug, name }) => {
                const Icon = getCategoryIcon(slug);
                return (
                  <NavLink
                    key={slug}
                    to={`${ROUTE_PATHS.PRODUCTS}?category=${slug}`}
                    className="flex flex-col items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-0 px-3 py-5 text-center shadow-card transition-colors duration-150 hover:border-primary-200 hover:bg-primary-50"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                      <Icon className="h-6 w-6" strokeWidth={1.75} />
                    </span>
                    <span className="text-sm font-medium text-neutral-700 capitalize">{name}</span>
                  </NavLink>
                );
              })}
        </div>
      )}
    </section>
  );
}
