import { NavLink } from 'react-router-dom';

import { SIDEBAR_NAV_ITEMS } from '../../../constants/nav.constants';

const HIGHLIGHT_IDS = ['fashion', 'electronics', 'home-living', 'accessories', 'deals', 'new-arrivals'];

export function CategoryHighlights() {
  const categories = SIDEBAR_NAV_ITEMS.filter((item) => HIGHLIGHT_IDS.includes(item.id));

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="mb-6 text-2xl font-semibold text-neutral-800">Shop by Category</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {categories.map(({ id, label, icon: Icon, path }) => (
          <NavLink
            key={id}
            to={path}
            className="flex flex-col items-center gap-2 rounded-lg border border-neutral-100 bg-neutral-0 px-3 py-5 text-center shadow-card transition-colors duration-150 hover:border-primary-200 hover:bg-primary-50"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600">
              <Icon className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <span className="text-sm font-medium text-neutral-700">{label}</span>
          </NavLink>
        ))}
      </div>
    </section>
  );
}
