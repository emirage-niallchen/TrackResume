import { Skeleton } from '@/components/ui/skeleton';

interface SectionSkeletonProps {
  height?: string;
}

export function SectionSkeleton({ height = "200px" }: SectionSkeletonProps) {
  return (
    <div className="w-full py-4">
      <Skeleton className="w-1/3 h-8 mb-4" />
      <div className="space-y-2">
        <Skeleton className={`w-full ${height}`} />
      </div>
    </div>
  );
} 