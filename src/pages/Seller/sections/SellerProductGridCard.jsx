import { Pencil, Trash2 } from 'lucide-react';

import { Badge } from '../../../components/common/Badge/Badge';
import { Card } from '../../../components/common/Card/Card';
import { IconButton } from '../../../components/common/IconButton/IconButton';
import { SELLER_PRODUCT_STATUS } from '../../../constants/sellerProducts.constants';
import { formatInr } from '../../../utils/formatCurrency';

function getStockBadgeVariant(stock) {
  if (stock <= 0) return 'danger';
  if (stock <= 5) return 'warning';
  return 'success';
}

// Mirrors the customer-facing ProductCard's visual language (Card +
// hover:shadow-elevated, letterboxed image, line-clamp title) so the seller
// console's card grid reads consistently with the rest of the app.
export function SellerProductGridCard({ product, onEdit, onDelete }) {
  return (
    <Card className="flex h-full flex-col transition-shadow duration-150 hover:shadow-elevated">
      <div className="flex h-32 items-center justify-center bg-neutral-50">
        <img src={product.imageUrl} alt="" className="h-full w-full object-contain p-3" />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium text-neutral-400">{product.category}</p>
        <h3 className="line-clamp-2 text-sm font-medium text-neutral-800">{product.name}</h3>

        <div className="flex items-center gap-1.5">
          <Badge variant={product.status === SELLER_PRODUCT_STATUS.ACTIVE ? 'success' : 'neutral'}>
            {product.status === SELLER_PRODUCT_STATUS.ACTIVE ? 'Active' : 'Inactive'}
          </Badge>
          <Badge variant={getStockBadgeVariant(product.stock)}>
            {product.stock === 0 ? 'Out of stock' : `${product.stock} in stock`}
          </Badge>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-semibold text-neutral-900">{formatInr(product.price)}</span>
          <div className="flex items-center gap-1">
            <IconButton icon={Pencil} label="Edit" size="sm" tooltip onClick={() => onEdit(product)} />
            <IconButton icon={Trash2} label="Delete" size="sm" tooltip onClick={() => onDelete(product)} />
          </div>
        </div>
      </div>
    </Card>
  );
}
