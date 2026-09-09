import { Heart, Share2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Badge } from '../../../components/common/Badge/Badge';
import { Button } from '../../../components/common/Button/Button';
import { IconButton } from '../../../components/common/IconButton/IconButton';
import { RatingStars } from '../../../components/product/RatingStars/RatingStars';
import { itemAdded } from '../../../features/cart/cartSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { ROUTE_PATHS } from '../../../routes/routePaths';
import { cn } from '../../../utils/cn';
import { getRatingBreakdown } from '../../../utils/ratingBreakdown';

function getAvailabilityBadge(status, stock) {
  const normalized = (status ?? '').toLowerCase();
  if (stock <= 0 || normalized.includes('out')) {
    return { variant: 'danger', label: status ?? 'Out of Stock' };
  }
  if (normalized.includes('low')) return { variant: 'warning', label: status };
  return { variant: 'success', label: status ?? 'In Stock' };
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-neutral-400">{label}</p>
      <p className="font-medium text-neutral-700">{value}</p>
    </div>
  );
}

export function ProductInfoSection({ product }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);

  const hasDiscount = product.discountPercentage > 0;
  const originalPrice = hasDiscount
    ? product.price / (1 - product.discountPercentage / 100)
    : null;
  const availabilityBadge = getAvailabilityBadge(product.availabilityStatus, product.stock);
  const outOfStock = product.stock <= 0;
  const { total: reviewCount } = getRatingBreakdown(product.id, product.rating);

  function handleShare() {
    const shareData = {
      title: product.title,
      text: product.description,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard?.writeText(shareData.url);
    }
  }

  function handleAddToCart() {
    dispatch(itemAdded({ id: product.id }));
  }

  function handleBuyNow() {
    dispatch(itemAdded({ id: product.id }));
    navigate(ROUTE_PATHS.CART);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-primary-600">
            {product.brand}
          </span>
          <h1 className="text-2xl font-semibold text-neutral-900">{product.title}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <IconButton icon={Share2} label="Share" onClick={handleShare} />
          <IconButton
            icon={Heart}
            label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={() => setWishlisted((current) => !current)}
            className={cn(wishlisted && 'text-danger-500 hover:text-danger-600')}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <RatingStars rating={product.rating} />
        <span className="text-sm text-neutral-500">
          {product.rating?.toFixed(1)} · {reviewCount} reviews
        </span>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <span className="text-3xl font-semibold text-neutral-900">
          ${product.price.toFixed(2)}
        </span>
        {hasDiscount ? (
          <>
            <span className="text-lg text-neutral-400 line-through">
              ${originalPrice.toFixed(2)}
            </span>
            <Badge variant="success">{Math.round(product.discountPercentage)}% off</Badge>
          </>
        ) : null}
      </div>

      <Badge variant={availabilityBadge.variant} className="w-fit">
        {availabilityBadge.label}
      </Badge>

      <p className="text-sm leading-relaxed text-neutral-600">{product.description}</p>

      {product.tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="neutral" className="capitalize">
              {tag}
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 rounded-lg bg-neutral-50 p-4 text-sm sm:grid-cols-3">
        <InfoRow label="SKU" value={product.sku} />
        <InfoRow label="Weight" value={product.weight ? `${product.weight}g` : null} />
        <InfoRow
          label="Dimensions"
          value={
            product.dimensions
              ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`
              : null
          }
        />
        <InfoRow label="Warranty" value={product.warrantyInformation} />
        <InfoRow label="Shipping" value={product.shippingInformation} />
        <InfoRow label="Return Policy" value={product.returnPolicy} />
        <InfoRow label="Min. Order Qty" value={product.minimumOrderQuantity} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          disabled={outOfStock}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        <Button variant="primary" size="lg" fullWidth disabled={outOfStock} onClick={handleBuyNow}>
          Buy Now
        </Button>
      </div>
    </div>
  );
}
