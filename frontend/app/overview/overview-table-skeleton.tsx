import { SkeletonText, SkeletonWrapper } from "components/skeleton";

export default function OverviewTableSkeleton() {
  return (
    <div className="flex flex-wrap">
      <div className="mb-4 w-full flex-none pr-6 md:mb-0 md:w-1/3">
        <SkeletonWrapper>
          <SkeletonText className="max-w-[60px]" />
          <SkeletonText className="max-w-[150px]" />
          <SkeletonText className="max-w-[160px]" />
          <SkeletonText className="max-w-[180px]" />
          <SkeletonText className="max-w-[170px]" />
          <SkeletonText className="max-w-[170px]" />
          <SkeletonText className="max-w-[150px]" />
        </SkeletonWrapper>
      </div>
      <div className="w-1/2 flex-none pr-6 md:w-1/3">
        <SkeletonWrapper>
          <SkeletonText className="max-w-[60px]" />
          <SkeletonText className="max-w-[140px]" />
          <SkeletonText className="max-w-[150px]" />
          <SkeletonText className="max-w-[150px]" />
          <SkeletonText className="max-w-[150px]" />
          <SkeletonText className="max-w-[150px]" />
          <SkeletonText className="max-w-[155px]" />
        </SkeletonWrapper>
      </div>
      <div className="w-1/2 flex-none md:w-1/3">
        <SkeletonWrapper>
          <SkeletonText className="max-w-[120px]" />
          <SkeletonText className="max-w-[50px]" />
          <SkeletonText className="max-w-[140px]" />
          <SkeletonText className="max-w-[150px]" />
          <SkeletonText className="max-w-[150px]" />
          <SkeletonText className="max-w-[130px]" />
          <SkeletonText className="max-w-[140px]" />
        </SkeletonWrapper>
      </div>
    </div>
  );
}
