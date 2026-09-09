import { BADGE_VARIANTS } from '../../../constants/ui.constants';
import { cn } from '../../../utils/cn';

export function Badge({ variant = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        BADGE_VARIANTS[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
