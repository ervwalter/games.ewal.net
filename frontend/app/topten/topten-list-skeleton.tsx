import { SkeletonImage, SkeletonRow, SkeletonText, SkeletonWrapper } from "components/skeleton";

export function TopTenListSkeleton() {
  return (
    <SkeletonWrapper className="flex flex-col divide-y border-gray-200  ">
      {[...Array(10)].map((_, index) => (
        <div className="flex flex-col items-start gap-6 py-4 first:pt-0 md:flex-row" key={index}>
          <div className="hidden w-10 flex-none text-2xl md:block">
            <SkeletonRow className="mt-0 w-[50px]" />
          </div>

          <div className="hidden w-[130px] flex-none md:block">
            <SkeletonImage className="mx-auto h-[126px] w-[100px]" />
          </div>
          <div className="w-full flex-1">
            <div className="flex flex-row gap-4">
              <div className="flex-1">
                <div>
                  <SkeletonRow className="mt-0 w-[200px]" />
                  <SkeletonText className="w-[300px]" />
                  <SkeletonText className="hidden w-10/12 md:block" />
                </div>
                <div className="flex-1 pt-4">
                  <SkeletonText />
                  <SkeletonText />
                  <SkeletonText />
                  <SkeletonText className="w-11/12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </SkeletonWrapper>
  );
}
