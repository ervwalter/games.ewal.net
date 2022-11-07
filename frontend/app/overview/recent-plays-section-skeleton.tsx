import { SkeletonImage, SkeletonRow, SkeletonWrapper } from "components/skeleton";

export default function RecentPlaysSectionSkeleton() {
  return (
    <>
      <RecentPlaysThumbnailsSkeleton />
      <RecentPlaysTableSkeleton />
    </>
  );
}

function RecentPlaysThumbnailsSkeleton() {
  return (
    <SkeletonWrapper className="hidden max-h-[110px] flex-row flex-wrap space-x-1 overflow-hidden md:flex">
      <SkeletonImage className="h-[110px] w-[90px]" />
      <SkeletonImage className="h-[110px] w-[90px]" />
      <SkeletonImage className="h-[110px] w-[90px]" />
      <SkeletonImage className="h-[110px] w-[90px]" />
      <SkeletonImage className="h-[110px] w-[90px]" />
      <SkeletonImage className="h-[110px] w-[90px]" />
      <SkeletonImage className="h-[110px] w-[90px]" />
      <SkeletonImage className="h-[110px] w-[90px]" />
      <SkeletonImage className="h-[110px] w-[90px]" />
      <SkeletonImage className="h-[110px] w-[90px]" />
      <SkeletonImage className="h-[110px] w-[90px]" />
      <SkeletonImage className="h-[110px] w-[90px]" />
      <SkeletonImage className="h-[110px] w-[90px]" />
    </SkeletonWrapper>
  );
}

function RecentPlaysTableSkeleton() {
  return (
    <SkeletonWrapper>
      <div className="grid w-full max-w-2xl grid-cols-[1fr_3fr_2fr_1fr] gap-y-4 gap-x-4">
        <SkeletonRow className="w-12" />
        <SkeletonRow className="w-12" />
        <SkeletonRow className="w-16" />
        <SkeletonRow className="w-16" />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </SkeletonWrapper>
  );
}
