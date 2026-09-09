import { Skeleton } from '../../../components/common/Skeleton/Skeleton';

export function HeroSkeleton() {
  return (
    <div className="px-6 py-6">
      <Skeleton className="h-(--hero-height) w-full rounded-xl" />
    </div>
  );
}
