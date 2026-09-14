import { CheckCircle2 } from 'lucide-react';

import { Card } from '../../../components/common/Card/Card';
import { cn } from '../../../utils/cn';

export function ProfileCompletionBar({ completion, className }) {
  const { percent, completedCount, totalCount, missingLabels } = completion;
  const isComplete = percent === 100;

  return (
    <Card className={cn('p-5', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {isComplete ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 text-success-600" strokeWidth={1.75} />
          ) : null}
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              {isComplete ? 'Your profile is complete' : 'Complete your profile'}
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">
              {completedCount} of {totalCount} details added
              {!isComplete && missingLabels.length > 0 ? ` — add ${missingLabels.join(', ')}` : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:w-56">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
            <div
              className={cn(
                'h-full rounded-full transition-[width] duration-300',
                isComplete ? 'bg-success-500' : 'bg-primary-600',
              )}
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-sm font-semibold tabular-nums text-neutral-800">{percent}%</span>
        </div>
      </div>
    </Card>
  );
}
