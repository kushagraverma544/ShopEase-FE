import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { ErrorState } from '../../../components/common/ErrorState/ErrorState';
import { Skeleton } from '../../../components/common/Skeleton/Skeleton';
import { getCategoryIcon } from '../../../constants/categoryIcons';
import { getCategoryImageQuery } from '../../../constants/categoryImageQueries';
import { CATEGORY_HIGHLIGHTS_SKELETON_COUNT } from '../../../constants/product.constants';
import { ROUTE_PATHS } from '../../../routes/routePaths';
import { getCategories } from '../../../services/productService';
import { getRandomPhoto } from '../../../services/unsplashService';

const MAX_CATEGORIES = 6;

function CategoryCardSkeleton() {
  return <Skeleton className="h-48 w-full rounded-lg sm:h-56 md:h-64" />;
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
        const shown = (data ?? []).slice(0, MAX_CATEGORIES);
        // Each category's photo is fetched independently so one failed
        // Unsplash call doesn't take down the whole section — it just falls
        // back to that category's icon instead.
        return Promise.all(
          shown.map((category) =>
            getRandomPhoto(getCategoryImageQuery(category.slug))
              .then((photo) => ({ ...category, imageUrl: photo.urls.regular }))
              .catch(() => ({ ...category, imageUrl: null })),
          ),
        );
      })
      .then((categoriesWithPhotos) => {
        if (!isMounted) return;
        setCategories(categoriesWithPhotos);
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
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {status === 'loading'
            ? Array.from({ length: CATEGORY_HIGHLIGHTS_SKELETON_COUNT }).map((_, index) => (
                <CategoryCardSkeleton key={index} />
              ))
            : categories.map(({ slug, name, imageUrl }) => {
                const Icon = getCategoryIcon(slug);
                return (
                  <NavLink
                    key={slug}
                    to={`${ROUTE_PATHS.PRODUCTS}?category=${slug}`}
                    className="group relative block h-48 w-full overflow-hidden rounded-lg shadow-card sm:h-56 md:h-64"
                  >
                    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-primary-50">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt=""
                          className="h-full w-full object-cover transition-[filter] duration-300 group-hover:blur-sm"
                        />
                      ) : (
                        <Icon className="h-12 w-12 text-primary-600" strokeWidth={1.5} />
                      )}
                    </div>

                    <div className="absolute inset-0 bg-neutral-900/0 transition-colors duration-300 group-hover:bg-neutral-900/40" />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="px-3 text-center text-lg font-semibold text-neutral-0 capitalize">
                        {name}
                      </span>
                    </div>
                  </NavLink>
                );
              })}
        </div>
      )}
    </section>
  );
}
