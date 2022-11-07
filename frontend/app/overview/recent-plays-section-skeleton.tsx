import { SkeletonImage, SkeletonRow, SkeletonWrapper } from "components/skeleton";

export default function RecentPlaysSectionSkeleton() {
  return (
    <>
      <RecentPlaysThumbnailsSkeleton />
      <RecentPlaysListNarrowSkeleton />
      <RecentPlaysListWideSkeleton />
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

function RecentPlaysListNarrowSkeleton() {
  return (
    <SkeletonWrapper className="md:hidden">
      {/* Row */}
      <div className="flex flex-row gap-8">
        <SkeletonRow className="w-24 flex-1" />
        <SkeletonRow className="w-16 flex-none" />
      </div>
      <div className="pb-5">
        <SkeletonRow className="w-60" />
      </div>
      {/* Row */}
      <div className="flex flex-row gap-8">
        <SkeletonRow className="w-24 flex-1" />
        <SkeletonRow className="w-16 flex-none" />
      </div>
      <div className="pb-5">
        <SkeletonRow className="w-60" />
      </div>
      {/* Row */}
      <div className="flex flex-row gap-8">
        <SkeletonRow className="w-24 flex-1" />
        <SkeletonRow className="w-16 flex-none" />
      </div>
      <div className="pb-5">
        <SkeletonRow className="w-60" />
      </div>
      {/* Row */}
      <div className="flex flex-row gap-8">
        <SkeletonRow className="w-24 flex-1" />
        <SkeletonRow className="w-16 flex-none" />
      </div>
      <div className="pb-5">
        <SkeletonRow className="w-60" />
      </div>
      {/* Row */}
      <div className="flex flex-row gap-8">
        <SkeletonRow className="w-24 flex-1" />
        <SkeletonRow className="w-16 flex-none" />
      </div>
      <div className="pb-5">
        <SkeletonRow className="w-60" />
      </div>
      {/* Row */}
      <div className="flex flex-row gap-8">
        <SkeletonRow className="w-24 flex-1" />
        <SkeletonRow className="w-16 flex-none" />
      </div>
      <div className="pb-5">
        <SkeletonRow className="w-60" />
      </div>
      {/* Row */}
      <div className="flex flex-row gap-8">
        <SkeletonRow className="w-24 flex-1" />
        <SkeletonRow className="w-16 flex-none" />
      </div>
      <div className="pb-5">
        <SkeletonRow className="w-60" />
      </div>
      {/* Row */}
      <div className="flex flex-row gap-8">
        <SkeletonRow className="w-24 flex-1" />
        <SkeletonRow className="w-16 flex-none" />
      </div>
      <div className="pb-5">
        <SkeletonRow className="w-60" />
      </div>
    </SkeletonWrapper>
  );
}

function RecentPlaysListWideSkeleton() {
  return (
    <SkeletonWrapper className="hidden md:block">
      <div className="grid w-full max-w-2xl grid-cols-[1fr_3fr_2fr_1fr] gap-y-4 gap-x-4">
        {/* Header */}
        <SkeletonRow className="w-12" />
        <SkeletonRow className="w-12" />
        <SkeletonRow className="w-12" />
        <SkeletonRow className="w-12" />
        {/* Row */}
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        {/* Row */}
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        {/* Row */}
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        {/* Row */}
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        {/* Row */}
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        {/* Row */}
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        {/* Row */}
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        {/* Row */}
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        {/* Row */}
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    </SkeletonWrapper>
  );
}
