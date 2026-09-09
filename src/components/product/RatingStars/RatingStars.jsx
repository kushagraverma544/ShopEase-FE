import { Star } from 'lucide-react';

import { cn } from '../../../utils/cn';

const ICON_SIZES = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

// fillAmount is 0-1: how much of this single star should be colored in.
function StarIcon({ fillAmount, iconSize }) {
  if (fillAmount <= 0) {
    return <Star className={cn(iconSize, 'text-neutral-200')} fill="currentColor" strokeWidth={0} />;
  }

  if (fillAmount >= 1) {
    return <Star className={cn(iconSize, 'text-warning-500')} fill="currentColor" strokeWidth={0} />;
  }

  return (
    <span className={cn('relative inline-block', iconSize)}>
      <Star
        className={cn(iconSize, 'absolute inset-0 text-neutral-200')}
        fill="currentColor"
        strokeWidth={0}
      />
      <span
        className="absolute inset-y-0 left-0 w-(--star-fill) overflow-hidden"
        style={{ '--star-fill': `${fillAmount * 100}%` }}
      >
        <Star className={cn(iconSize, 'text-warning-500')} fill="currentColor" strokeWidth={0} />
      </span>
    </span>
  );
}

export function RatingStars({ rating, size = 'md', className }) {
  const iconSize = ICON_SIZES[size];
  const safeRating = Math.max(0, Math.min(rating ?? 0, 5));

  return (
    <span className={cn('inline-flex gap-0.5', className)}>
      {Array.from({ length: 5 }).map((_, index) => {
        const fillAmount = Math.min(Math.max(safeRating - index, 0), 1);
        return <StarIcon key={index} fillAmount={fillAmount} iconSize={iconSize} />;
      })}
    </span>
  );
}
