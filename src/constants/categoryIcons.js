import {
  Bike,
  Car,
  ChefHat,
  Droplet,
  Droplets,
  Dumbbell,
  Footprints,
  Gem,
  Glasses,
  Home,
  Laptop,
  Package,
  Shirt,
  ShoppingBag,
  ShoppingBasket,
  Smartphone,
  Sofa,
  Sparkles,
  Tablet,
  Tag,
  Watch,
} from 'lucide-react';

// Icon per category slug, as returned by GET /catalog/products/categories.
// Any slug not listed here (categories are backend-driven and can change)
// falls back to a generic icon rather than breaking the layout.
const CATEGORY_ICON_MAP = {
  beauty: Sparkles,
  fragrances: Droplet,
  furniture: Sofa,
  groceries: ShoppingBasket,
  'home-decoration': Home,
  'kitchen-accessories': ChefHat,
  laptops: Laptop,
  'mens-shirts': Shirt,
  'mens-shoes': Footprints,
  'mens-watches': Watch,
  'mobile-accessories': Package,
  motorcycle: Bike,
  'skin-care': Droplets,
  smartphones: Smartphone,
  'sports-accessories': Dumbbell,
  sunglasses: Glasses,
  tablets: Tablet,
  tops: Shirt,
  vehicle: Car,
  'womens-bags': ShoppingBag,
  'womens-dresses': Shirt,
  'womens-jewellery': Gem,
  'womens-shoes': Footprints,
  'womens-watches': Watch,
};

export function getCategoryIcon(slug) {
  return CATEGORY_ICON_MAP[slug] ?? Tag;
}
