import { PackagePlus } from 'lucide-react';

import { Card } from '../../../components/common/Card/Card';
import { formatInr } from '../../../utils/formatCurrency';
import { formatRelativeDate } from '../../../utils/formatRelativeDate';
import { SectionHeader } from './SectionHeader';

export function RecentlyAddedListingsCard({ products }) {
  return (
    <Card className="px-5 py-4">
      <SectionHeader icon={PackagePlus} color="accent" title="Recently Added Listings" />

      {products.length === 0 ? (
        <p className="text-sm text-neutral-500">You haven't listed any products yet.</p>
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
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900">{product.name}</p>
                <p className="text-xs tabular-nums text-neutral-500">{formatInr(product.price)}</p>
              </div>
              <span className="text-xs text-neutral-400">Added {formatRelativeDate(product.createdAt)}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default RecentlyAddedListingsCard;
