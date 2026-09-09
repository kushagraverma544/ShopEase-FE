import { Card } from '../../common/Card/Card';
import { Skeleton } from '../../common/Skeleton/Skeleton';

export function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <Skeleton className="h-32 w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <div className="mt-auto flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </div>
    </Card>
  );
}
