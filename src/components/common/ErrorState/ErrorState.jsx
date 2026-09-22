import { RefreshCw, TriangleAlert } from 'lucide-react';

import { cn } from '../../../utils/cn';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

export function ErrorState({
  title = 'Something went wrong',
  message = "We couldn't load this right now. Please try again.",
  onRetry,
  className,
}) {
  return (
    <Card className={cn('flex flex-col items-center gap-4 px-6 py-14 text-center', className)}>
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-50 text-danger-500 dark:bg-danger-500/10 dark:text-danger-400">
        <TriangleAlert className="h-7 w-7" strokeWidth={1.5} />
      </span>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{title}</h3>
        <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="primary" size="md" onClick={onRetry} className="mt-2">
          <RefreshCw className="h-4 w-4" strokeWidth={2} />
          Try Again
        </Button>
      ) : null}
    </Card>
  );
}
