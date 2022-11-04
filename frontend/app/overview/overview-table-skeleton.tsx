import { Skeleton, SkeletonRow } from "components/skeleton";

export default function OverviewTableSkeleton() {
  return (
    <div className="flex flex-wrap">
      <div className="mb-4 w-full flex-none pr-6 md:mb-0 md:w-1/3">
        <Skeleton>
          <SkeletonRow className="max-w-[60px]" />
          <SkeletonRow className="max-w-[150px]" />
          <SkeletonRow className="max-w-[160px]" />
          <SkeletonRow className="max-w-[180px]" />
          <SkeletonRow className="max-w-[170px]" />
          <SkeletonRow className="max-w-[170px]" />
          <SkeletonRow className="max-w-[150px]" />
        </Skeleton>
      </div>
      <div className="w-1/2 flex-none pr-6 md:w-1/3">
        <Skeleton>
          <SkeletonRow className="max-w-[60px]" />
          <SkeletonRow className="max-w-[140px]" />
          <SkeletonRow className="max-w-[150px]" />
          <SkeletonRow className="max-w-[150px]" />
          <SkeletonRow className="max-w-[150px]" />
          <SkeletonRow className="max-w-[150px]" />
          <SkeletonRow className="max-w-[155px]" />
        </Skeleton>
      </div>
      <div className="w-1/2 flex-none md:w-1/3">
        <Skeleton>
          <SkeletonRow className="max-w-[120px]" />
          <SkeletonRow className="max-w-[50px]" />
          <SkeletonRow className="max-w-[140px]" />
          <SkeletonRow className="max-w-[150px]" />
          <SkeletonRow className="max-w-[150px]" />
          <SkeletonRow className="max-w-[130px]" />
          <SkeletonRow className="max-w-[140px]" />
        </Skeleton>
      </div>
    </div>
  );
}
