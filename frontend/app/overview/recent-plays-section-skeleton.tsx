import { SkeletonRow, SkeletonWrapper } from "components/skeleton";
import { ThumbnailListSkeleton } from "components/thumbnail-list";

export default function RecentPlaysSectionSkeleton() {
  return (
    <>
      <ThumbnailListSkeleton singleRow={true} />
      <RecentPlaysListNarrowSkeleton />
      <RecentPlaysListWideSkeleton />
    </>
  );
}

function RecentPlaysListNarrowSkeleton() {
  return (
    <SkeletonWrapper className="-mx-4 border-t border-gray-100 md:hidden">
      {[...Array(25)].map((_, index) => (
        <div className="border-b border-gray-100 px-4 py-2 even:bg-gray-100 even:bg-opacity-50" key={index}>
          <div className="flex flex-row gap-8">
            <SkeletonRow className="w-24 flex-1" />
            <SkeletonRow className="w-16 flex-none" />
          </div>
          <div>
            <SkeletonRow className="w-60" />
          </div>
        </div>
      ))}
    </SkeletonWrapper>
  );
}

function RecentPlaysListWideSkeleton() {
  return (
    <SkeletonWrapper className="hidden md:block">
      <table className="min-w-full divide-y divide-gray-300 md:min-w-fit">
        <thead>
          <tr>
            <th className="w-[50px] py-3 px-2 text-left font-semibold text-gray-900 md:pl-0">Date</th>
            <th className="w-[350px] py-3 px-2 text-left font-semibold text-gray-900">Game</th>
            <th className="w-[350px] py-3 px-2 text-left font-semibold text-gray-900">Players</th>
            <th className="w-[70px] py-3 px-2 text-left font-semibold text-gray-900">Location</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(25)].map((_, index) => (
            <tr className="even:bg-gray-100 even:bg-opacity-50" key={index}>
              <td className="whitespace-nowrap py-3 px-2 md:pl-0">
                <SkeletonRow />
              </td>
              <td className="py-3 px-2">
                <SkeletonRow />
              </td>
              <td className="py-3 px-2">
                <SkeletonRow />
              </td>
              <td className="py-3 px-2">
                <SkeletonRow />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SkeletonWrapper>
  );
}
