import { ShoppingBag } from 'lucide-react';

import { Badge } from '../../../components/common/Badge/Badge';
import { Card } from '../../../components/common/Card/Card';
import { formatInr } from '../../../utils/formatCurrency';
import { formatRelativeDate } from '../../../utils/formatRelativeDate';
import { SectionHeader } from './SectionHeader';

const STATUS_BADGE_VARIANT = {
  pending: 'warning',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
};

export function RecentOrdersCard({ orders }) {
  return (
    <Card className="px-5 py-4">
      <SectionHeader icon={ShoppingBag} color="primary" title="Recent Orders" />

      {orders.length === 0 ? (
        <p className="text-sm text-neutral-500">No orders yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-neutral-100">
          {orders.map((order) => (
            <div
              key={order.id}
              className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-neutral-50"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900">{order.productName}</p>
                <p className="text-xs text-neutral-500">
                  {order.orderNumber} · {order.customerName} · Qty {order.quantity}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-medium tabular-nums text-neutral-900">
                  {formatInr(order.amount)}
                </span>
                <Badge variant={STATUS_BADGE_VARIANT[order.status]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <span className="w-16 shrink-0 text-right text-xs text-neutral-400">
                {formatRelativeDate(order.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default RecentOrdersCard;
