import { LineChart } from 'lucide-react';
import { useRef, useState } from 'react';

import { Card } from '../../../components/common/Card/Card';
import { formatInr, formatInrCompact } from '../../../utils/formatCurrency';
import { SectionHeader } from './SectionHeader';

const WIDTH = 600;
const HEIGHT = 220;
const PADDING = { top: 16, right: 12, bottom: 28, left: 44 };
const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;

function niceMaxOf(values) {
  const max = Math.max(...values, 1);
  const magnitude = 10 ** Math.floor(Math.log10(max));
  return Math.ceil(max / magnitude) * magnitude;
}

// Single-series line chart, hand-rolled (no charting dependency) per the
// dataviz skill's mark specs: 2px line, ~10%-opacity area wash, an 8px+
// end-marker with a surface ring, and a pointer-tracked crosshair + tooltip.
export function SalesTrendCard({ data }) {
  const svgRef = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  const revenues = data.map((point) => point.revenue);
  const maxRevenue = niceMaxOf(revenues);

  const points = data.map((point, index) => {
    const x =
      data.length > 1 ? PADDING.left + (index / (data.length - 1)) * PLOT_WIDTH : PADDING.left;
    const y = PADDING.top + PLOT_HEIGHT - (point.revenue / maxRevenue) * PLOT_HEIGHT;
    return { ...point, x, y };
  });

  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x},${point.y}`).join(' ');
  const baselineY = PADDING.top + PLOT_HEIGHT;
  const areaPath = `${linePath} L ${points[points.length - 1].x},${baselineY} L ${points[0].x},${baselineY} Z`;

  const lastPoint = points[points.length - 1];
  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  function handlePointerMove(event) {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const viewBoxX = ratio * WIDTH;
    let nearest = 0;
    let nearestDistance = Infinity;
    points.forEach((point, index) => {
      const distance = Math.abs(point.x - viewBoxX);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }
    });
    setHoverIndex(nearest);
  }

  return (
    <Card className="px-5 py-4">
      <SectionHeader icon={LineChart} color="primary" title="Sales Trend" subtitle={`Last ${data.length} days`} />

      <div className="relative mt-2">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          className="h-56 w-full"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverIndex(null)}
        >
          {[0, 0.5, 1].map((fraction) => {
            const y = PADDING.top + PLOT_HEIGHT * (1 - fraction);
            return (
              <g key={fraction}>
                <line
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={y}
                  y2={y}
                  className="stroke-neutral-100"
                  strokeWidth={1}
                />
                <text x={PADDING.left - 8} y={y} textAnchor="end" dominantBaseline="middle" className="fill-neutral-400 text-[9px]">
                  {formatInrCompact(Math.round(maxRevenue * fraction))}
                </text>
              </g>
            );
          })}

          <path d={areaPath} className="fill-primary-500/10" />
          <path d={linePath} fill="none" className="stroke-primary-600" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {hovered ? (
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={PADDING.top}
              y2={baselineY}
              className="stroke-neutral-300"
              strokeWidth={1}
            />
          ) : null}

          <circle cx={lastPoint.x} cy={lastPoint.y} r={5} className="fill-primary-600 stroke-neutral-0" strokeWidth={2} />
          <text x={lastPoint.x} y={lastPoint.y - 12} textAnchor="end" className="fill-neutral-900 text-[11px] font-semibold">
            {formatInrCompact(lastPoint.revenue)}
          </text>

          {hovered ? (
            <circle cx={hovered.x} cy={hovered.y} r={5} className="fill-primary-600 stroke-neutral-0" strokeWidth={2} />
          ) : null}

          <text x={points[0].x} y={HEIGHT - 8} textAnchor="start" className="fill-neutral-400 text-[9px]">
            {new Date(points[0].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </text>
          <text x={lastPoint.x} y={HEIGHT - 8} textAnchor="end" className="fill-neutral-400 text-[9px]">
            {new Date(lastPoint.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </text>
        </svg>

        {hovered ? (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-md border border-neutral-100 bg-neutral-0 px-3 py-1.5 shadow-drawer"
            style={{ left: `${(hovered.x / WIDTH) * 100}%` }}
          >
            <p className="text-xs font-semibold text-neutral-900">{formatInr(hovered.revenue)}</p>
            <p className="text-2xs text-neutral-500">
              {new Date(hovered.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </p>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

export default SalesTrendCard;
