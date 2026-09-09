import { NavLink } from 'react-router-dom';

import { Button } from '../../../components/common/Button/Button';
import { ROUTE_PATHS } from '../../../routes/routePaths';

// Shown when the Unsplash-backed carousel can't load (missing/invalid API
// key, network failure, rate limit) — the hero should never look broken.
export function HeroFallback() {
  return (
    <section className="bg-primary-600 px-6 py-16 md:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <span className="rounded-full bg-primary-500 px-4 py-1 text-sm font-medium text-neutral-0">
          New Season Arrivals
        </span>
        <h1 className="text-3xl font-semibold text-neutral-0 md:text-4xl">
          Shop the Latest Trends, All in One Place
        </h1>
        <p className="max-w-2xl text-base text-primary-100">
          Discover curated collections across fashion, electronics, home &amp; living — with fast
          delivery and easy returns.
        </p>
        <Button as={NavLink} to={ROUTE_PATHS.PRODUCTS} size="lg" variant="accent">
          Start Shopping
        </Button>
      </div>
    </section>
  );
}
