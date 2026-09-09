import { Skeleton } from '../../../components/common/Skeleton/Skeleton';

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="flex gap-4">
        <div className="flex w-20 shrink-0 flex-col gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-16 rounded-md" />
          ))}
        </div>
        <Skeleton className="h-96 flex-1 rounded-lg" />
      </div>

      <div className="flex flex-col gap-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-12 flex-1 rounded-md" />
          <Skeleton className="h-12 flex-1 rounded-md" />
        </div>
      </div>
    </div>
  );
}
