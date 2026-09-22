import { CheckCircle2, TriangleAlert, X } from 'lucide-react';
import { useEffect } from 'react';

import { cn } from '../../../utils/cn';
import { IconButton } from '../IconButton/IconButton';

const VARIANTS = {
  success: {
    icon: CheckCircle2,
    bgClassName: 'bg-success-50 dark:bg-success-500/10',
    iconClassName: 'text-success-600 dark:text-success-400',
  },
  error: {
    icon: TriangleAlert,
    bgClassName: 'bg-danger-50 dark:bg-danger-500/10',
    iconClassName: 'text-danger-600 dark:text-danger-400',
  },
};

// Fire-and-forget feedback for an action that just completed (a save, a
// delete, a preference toggle) — not for a page-level empty/error state,
// that's ErrorState's job.
export function Banner({ variant = 'success', message, onDismiss, autoDismissMs = 4000, className }) {
  useEffect(() => {
    if (!message || !onDismiss || !autoDismissMs) return undefined;
    const timer = setTimeout(onDismiss, autoDismissMs);
    return () => clearTimeout(timer);
  }, [message, onDismiss, autoDismissMs]);

  if (!message) return null;

  const { icon: Icon, bgClassName, iconClassName } = VARIANTS[variant];

  return (
    <div
      role="status"
      className={cn(
        'flex items-start gap-3 rounded-lg px-4 py-3 text-sm font-medium text-neutral-800 dark:text-neutral-100',
        bgClassName,
        className,
      )}
    >
      <Icon className={cn('h-5 w-5 shrink-0', iconClassName)} strokeWidth={1.75} />
      <p className="flex-1">{message}</p>
      {onDismiss ? (
        <IconButton icon={X} label="Dismiss" size="sm" onClick={onDismiss} className="-my-1 -mr-1 shrink-0" />
      ) : null}
    </div>
  );
}
