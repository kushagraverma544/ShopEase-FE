import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import { Button } from '../../../components/common/Button/Button';
import { Skeleton } from '../../../components/common/Skeleton/Skeleton';
import { PROMO_BANNER_CONTENT } from '../../../constants/promoBanner.constants';
import { ROUTE_PATHS } from '../../../routes/routePaths';
import { getRandomPhoto } from '../../../services/unsplashService';

export function PromoBanner() {
  const [imageUrl, setImageUrl] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let isMounted = true;
    getRandomPhoto(PROMO_BANNER_CONTENT.unsplashQuery)
      .then((photo) => {
        if (!isMounted) return;
        setImageUrl(photo.urls.regular);
        setStatus('success');
      })
      .catch(() => {
        if (isMounted) setStatus('error');
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (status === 'loading') {
    return (
      <section className="mx-auto max-w-6xl px-6 py-4">
        <Skeleton className="h-64 w-full rounded-xl md:h-72" />
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className="mx-auto max-w-6xl px-6 py-4">
        <div className="flex flex-col items-center justify-between gap-4 rounded-xl bg-accent-50 px-6 py-8 text-center md:flex-row md:text-left">
          <div>
            <h3 className="text-xl font-semibold text-accent-700">{PROMO_BANNER_CONTENT.title}</h3>
            <p className="text-sm text-neutral-600">{PROMO_BANNER_CONTENT.description}</p>
          </div>
          <Button as={NavLink} to={ROUTE_PATHS.PRODUCTS} variant="accent">
            {PROMO_BANNER_CONTENT.ctaLabel}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-4">
      <div className="relative h-64 w-full overflow-hidden rounded-xl shadow-elevated md:h-72">
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 via-neutral-900/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-start justify-center gap-3 px-8 md:px-12">
          <span className="text-xs font-semibold uppercase tracking-wide text-accent-400">
            {PROMO_BANNER_CONTENT.badge}
          </span>
          <h3 className="text-2xl font-semibold text-neutral-0 md:text-3xl">
            {PROMO_BANNER_CONTENT.title}
          </h3>
          <p className="max-w-md text-sm text-neutral-100">{PROMO_BANNER_CONTENT.description}</p>
          <Button as={NavLink} to={ROUTE_PATHS.PRODUCTS} variant="accent" className="mt-2">
            {PROMO_BANNER_CONTENT.ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
