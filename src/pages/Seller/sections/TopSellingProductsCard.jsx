import { TrendingUp } from 'lucide-react';

import { Card } from '../../../components/common/Card/Card';
import { cn } from '../../../utils/cn';
import { formatInr } from '../../../utils/formatCurrency';
import { SectionHeader } from './SectionHeader';

const RANK_BADGE_CLASSES = {
  1: 'bg-accent-500 text-neutral-0',
  2: 'bg-neutral-300 text-neutral-700',
  3: 'bg-accent-100 text-accent-700',
};

function RankBadge({ rank }) {
  return (
    <span
      className={cn(
        'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
        RANK_BADGE_CLASSES[rank] ?? 'bg-neutral-100 text-neutral-500',
      )}
    >
      {rank}
    </span>
  );
}

export function TopSellingProductsCard({ products }) {
  return (
    <Card className="px-5 py-4">
      <SectionHeader icon={TrendingUp} color="success" title="Top Selling Products" />

      {products.length === 0 ? (
        <p className="text-sm text-neutral-500">No sales yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-neutral-100">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-neutral-50"
            >
              <RankBadge rank={index + 1} />
              <img
                src={product.imageUrl}
                alt=""
                className="h-11 w-11 shrink-0 rounded-lg bg-neutral-100 object-cover ring-1 ring-neutral-100"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900">{product.name}</p>
                <p className="text-xs text-neutral-500">{product.unitsSold} sold</p>
              </div>
              <span className="text-sm font-medium tabular-nums text-neutral-900">
                {formatInr(product.unitsSold * product.price)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default TopSellingProductsCard;
