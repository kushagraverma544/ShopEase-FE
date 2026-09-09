import { Link } from 'react-router-dom';

import { Badge } from '../../../components/common/Badge/Badge';
import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { itemAdded } from '../../../features/cart/cartSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { getProductDetailsPath } from '../../../routes/routePaths';

function getStockBadge(stock) {
  if (stock <= 0) return { variant: 'danger', label: 'Out of stock' };
  if (stock <= 5) return { variant: 'warning', label: `Only ${stock} left` };
  return { variant: 'success', label: 'In stock' };
}

export function ProductCard({ product }) {
  const dispatch = useAppDispatch();
  const stockBadge = getStockBadge(product.stock);

  function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(itemAdded({ id: product.id }));
  }

  return (
    <Link to={getProductDetailsPath(product.id)} className="block h-full">
      <Card className="flex h-full flex-col transition-shadow duration-150 hover:shadow-elevated">
        <div className="flex h-32 items-center justify-center bg-neutral-50">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full object-contain p-3"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <span className="text-xs font-medium text-neutral-400 capitalize">
            {product.category}
          </span>
          <h3 className="line-clamp-2 text-sm font-medium text-neutral-800">{product.title}</h3>
          <Badge variant={stockBadge.variant} className="w-fit">
            {stockBadge.label}
          </Badge>
          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="text-base font-semibold text-neutral-900">
              ${product.price.toFixed(2)}
            </span>
            <Button size="sm" disabled={product.stock <= 0} onClick={handleAddToCart}>
              Add
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
