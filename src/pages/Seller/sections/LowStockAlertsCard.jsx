import { TriangleAlert } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { Badge } from '../../../components/common/Badge/Badge';
import { Card } from '../../../components/common/Card/Card';
import { ROUTE_PATHS } from '../../../routes/routePaths';
import { SectionHeader } from './SectionHeader';

export function LowStockAlertsCard({ products }) {
  return (
    <Card className="px-5 py-4">
      <SectionHeader icon={TriangleAlert} color="warning" title="Low Stock Alerts" />

      {products.length === 0 ? (
        <p className="text-sm text-neutral-500">All products are well stocked.</p>
      ) : (
        <div className="flex flex-col divide-y divide-neutral-100">
          {products.map((product) => (
            <div
              key={product.id}
              className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-neutral-50"
            >
              <img
                src={product.imageUrl}
                alt=""
                className="h-11 w-11 shrink-0 rounded-lg bg-neutral-100 object-cover ring-1 ring-neutral-100"
              />
              <p className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-900">
                {product.name}
              </p>
              <Badge variant={product.stock === 0 ? 'danger' : 'warning'}>
                {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
              </Badge>
              <NavLink
                to={ROUTE_PATHS.SELLER_LISTINGS}
                className="text-xs font-medium text-primary-600 hover:underline"
              >
                Manage
              </NavLink>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default LowStockAlertsCard;
