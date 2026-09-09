import { formatSlug } from '../utils/formatSlug';

// Unsplash search query per category slug, for the "Shop by Category" photo
// tiles. Any slug not listed here (categories are backend-driven and can
// change) falls back to a query built from its own name.
const CATEGORY_IMAGE_QUERY_MAP = {
  beauty: 'makeup cosmetics beauty',
  fragrances: 'perfume bottle luxury',
  furniture: 'modern furniture living room',
  groceries: 'fresh groceries vegetables',
  'home-decoration': 'home decor interior',
  'kitchen-accessories': 'kitchen cookware utensils',
  laptops: 'laptop computer workspace',
  'mens-shirts': 'men shirt fashion',
  'mens-shoes': 'men sneakers shoes',
  'mens-watches': 'men wristwatch',
  'mobile-accessories': 'phone accessories gadgets',
  motorcycle: 'motorcycle bike',
  'skin-care': 'skincare products',
  smartphones: 'smartphone technology',
  'sports-accessories': 'sports equipment fitness',
  sunglasses: 'sunglasses fashion',
  tablets: 'tablet device',
  tops: 'women fashion top clothing',
  vehicle: 'car vehicle',
  'womens-bags': 'women handbag fashion',
  'womens-dresses': 'women dress fashion',
  'womens-jewellery': 'jewellery gold fashion',
  'womens-shoes': 'women shoes fashion',
  'womens-watches': 'women wristwatch',
};

export function getCategoryImageQuery(slug) {
  return CATEGORY_IMAGE_QUERY_MAP[slug] ?? `${formatSlug(slug)} product`;
}
