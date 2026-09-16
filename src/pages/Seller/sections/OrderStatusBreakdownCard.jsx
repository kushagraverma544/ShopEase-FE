import { PieChart } from 'lucide-react';

import { Card } from '../../../components/common/Card/Card';
import { cn } from '../../../utils/cn';
import { SectionHeader } from './SectionHeader';

// Order status is genuinely a "state" job, not arbitrary series identity —
// reuse the app's existing semantic tokens (the same ones Badge/Listings use
// for Active/Inactive) rather than inventing new colors.
const SEGMENTS = [
  { key: 'pending', label: 'Pending', stroke: 'stroke-warning-500', tileBg: 'bg-warning-50', dotClass: 'bg-warning-500' },
  { key: 'shipped', label: 'Shipped', stroke: 'stroke-primary-500', tileBg: 'bg-primary-50', dotClass: 'bg-primary-500' },
  { key: 'delivered', label: 'Delivered', stroke: 'stroke-success-500', tileBg: 'bg-success-50', dotClass: 'bg-success-500' },
  { key: 'cancelled', label: 'Cancelled', stroke: 'stroke-danger-500', tileBg: 'bg-danger-50', dotClass: 'bg-danger-500' },
];

const SIZE = 176;
const CENTER = SIZE / 2;
const RADIUS = 66;
const STROKE_WIDTH = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function OrderStatusBreakdownCard({ data }) {
  const segments = SEGMENTS.filter((segment) => data[segment.key] > 0);

  const arcs = segments.reduce((accumulated, segment) => {
    const previous = accumulated[accumulated.length - 1];
    const cumulative = previous ? previous.offset * -1 + previous.dash : 0;
    const fraction = data[segment.key] / data.total;
    const dash = fraction * CIRCUMFERENCE;
    return [...accumulated, { ...segment, dash, offset: -cumulative }];
  }, []);

  return (
    <Card className="px-5 py-4">
      <SectionHeader icon={PieChart} color="primary" title="Order Status" subtitle={`${data.total} orders total`} />

      {data.total === 0 ? (
        <p className="mt-6 text-sm text-neutral-500">No orders yet.</p>
      ) : (
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-44 w-44">
              <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
                {arcs.map((arc) => (
                  <circle
                    key={arc.key}
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill="none"
                    strokeWidth={STROKE_WIDTH}
                    className={arc.stroke}
                    strokeDasharray={`${arc.dash} ${CIRCUMFERENCE - arc.dash}`}
                    strokeDashoffset={arc.offset}
                  />
                ))}
              </g>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-neutral-900">{data.total}</span>
              <span className="text-xs text-neutral-500">Orders</span>
            </div>
          </div>

          <div className="mt-5 grid w-full grid-cols-2 gap-2.5">
            {segments.map((segment) => {
              const percent = Math.round((data[segment.key] / data.total) * 100);
              return (
                <div key={segment.key} className={cn('flex items-center gap-2 rounded-lg px-3 py-2', segment.tileBg)}>
                  <span className={cn('h-2 w-2 shrink-0 rounded-full', segment.dotClass)} />
                  <div>
                    <p className="text-xs text-neutral-500">{segment.label}</p>
                    <p className="text-sm font-semibold text-neutral-900">
                      {data[segment.key]}
                      <span className="ml-1 font-normal text-neutral-400">{percent}%</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

export default OrderStatusBreakdownCard;
