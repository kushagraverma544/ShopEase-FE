import { NavLink } from 'react-router-dom';

import { Button } from '../../../components/common/Button/Button';
import { ROUTE_PATHS } from '../../../routes/routePaths';

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-4">
      <div className="flex flex-col items-center justify-between gap-4 rounded-lg bg-accent-50 px-6 py-8 text-center md:flex-row md:text-left">
        <div>
          <h3 className="text-xl font-semibold text-accent-700">End of Season Sale</h3>
          <p className="text-sm text-neutral-600">Up to 50% off on select categories. Limited time only.</p>
        </div>
        <Button as={NavLink} to={ROUTE_PATHS.PRODUCTS} variant="accent">
          Grab the Deal
        </Button>
      </div>
    </section>
  );
}
