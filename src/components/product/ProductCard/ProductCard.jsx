import { Badge } from '../../../components/common/Badge/Badge';
import { Button } from '../../../components/common/Button/Button';
import { Card } from '../../../components/common/Card/Card';
import { itemAdded } from '../../../features/cart/cartSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';

function getStockBadge(stock) {
  if (stock <= 0) return { variant: 'danger', label: 'Out of stock' };
  if (stock <= 5) return { variant: 'warning', label: `Only ${stock} left` };
  return { variant: 'success', label: 'In stock' };
}

export function ProductCard({ product }) {
  const dispatch = useAppDispatch();
  const stockBadge = getStockBadge(product.stock);

  return (
    <Card className="flex flex-col">
      <div className="flex h-32 items-center justify-center bg-neutral-50">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-contain p-3"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-medium text-neutral-400 capitalize">{product.category}</span>
        <h3 className="line-clamp-2 text-sm font-medium text-neutral-800">{product.title}</h3>
        <Badge variant={stockBadge.variant} className="w-fit">
          {stockBadge.label}
        </Badge>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-base font-semibold text-neutral-900">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            disabled={product.stock <= 0}
            onClick={() => dispatch(itemAdded({ id: product.id }))}
          >
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
