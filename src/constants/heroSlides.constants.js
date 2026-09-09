import { ROUTE_PATHS } from '../routes/routePaths';

// Curated marketing copy per slide. `unsplashQuery` only drives which
// background photo gets fetched for that slide — Unsplash's own photo
// descriptions are unreliable/often empty, so real copy always comes from
// here, never from the API response.
export const HERO_SLIDES_CONTENT = [
  {
    id: 'season',
    badge: 'New Season Arrivals',
    title: 'Shop the Latest Trends, All in One Place',
    description: 'Discover curated collections across fashion, electronics, home & living.',
    ctaLabel: 'Start Shopping',
    ctaPath: ROUTE_PATHS.PRODUCTS,
    unsplashQuery: 'fashion shopping lifestyle',
  },
  {
    id: 'electronics',
    badge: 'Tech Deals',
    title: 'Upgrade Your Everyday Tech',
    description: 'Smartphones, laptops and accessories at prices that make sense.',
    ctaLabel: 'Explore Electronics',
    ctaPath: `${ROUTE_PATHS.PRODUCTS}?category=smartphones`,
    unsplashQuery: 'modern electronics gadgets',
  },
  {
    id: 'home',
    badge: 'Home Refresh',
    title: 'Make Your Home Feel New',
    description: 'Furniture and decor picks to refresh every room.',
    ctaLabel: 'Shop Home & Living',
    ctaPath: `${ROUTE_PATHS.PRODUCTS}?category=furniture`,
    unsplashQuery: 'cozy home interior decor',
  },
];

export const HERO_ROTATION_INTERVAL_MS = 5000;
