import { Blurb } from "components/blurb";
import { SkeletonBarChart, SkeletonPieChart, SkeletonRow, SkeletonWrapper } from "components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-2xl font-semibold">Patterns and Statistics</h2>
      <InsightsChartsSkeleton />
      <h2 className="text-2xl font-semibold">Player Stats</h2>
      <PlayersTableSkeleton />
    </div>
  );
}

function InsightsChartsSkeleton() {
  return (
    <SkeletonWrapper className="flex flex-row flex-wrap items-center justify-start gap-4">
      <div className="flex w-full max-w-[350px] flex-col items-center ">
        <div className="text-center font-semibold">&nbsp;</div>
        <div className="flex h-[175px] w-[350px] flex-col items-center justify-center">
          <SkeletonPieChart className="h-28 w-28 flex-none" />
        </div>
      </div>
      <div className="flex w-full max-w-[350px] flex-col items-center ">
        <div className="text-center font-semibold">&nbsp;</div>
        <div className="flex h-[175px] w-[350px] flex-col items-center justify-center">
          <SkeletonPieChart className="h-28 w-28 flex-none" />
        </div>
      </div>
      <div className="flex w-full max-w-[350px] flex-col items-center ">
        <div className="text-center font-semibold">&nbsp;</div>
        <div className="flex h-[175px] w-[350px] flex-col items-center justify-center">
          <SkeletonPieChart className="h-28 w-28 flex-none" />
        </div>
      </div>
      <div className="flex w-full max-w-[350px] flex-col items-center ">
        <div className="text-center font-semibold">&nbsp;</div>
        <div className="flex h-[175px] w-[350px] flex-col items-center justify-center">
          <SkeletonPieChart className="h-28 w-28 flex-none" />
        </div>
      </div>
      <div className="flex w-full max-w-[600px] flex-col pb-4">
        <div className="pb-2 text-center font-semibold">&nbsp;</div>
        <div className="flex h-[250px] w-full flex-col items-center justify-center">
          <SkeletonBarChart className="h-28 w-28 flex-none" />
        </div>
      </div>
    </SkeletonWrapper>
  );
}

function PlayersTableSkeleton() {
  return (
    <div className="-mx-4 md:mx-0">
      <table className="min-w-full divide-y divide-gray-300 md:min-w-fit">
        <thead>
          <tr>
            <th className="w-[140px] py-2 pr-4 pl-4 text-left font-semibold text-gray-900 md:pl-0"> Name</th>
            <th className="cursor-pointer py-2 px-2 text-right font-semibold text-gray-900"> Plays</th>
            <th className="hidden cursor-pointer py-2 px-2 text-right font-semibold text-gray-900 md:table-cell">
              Games
            </th>
            <th className="cursor-pointer py-2 px-2 text-right font-semibold text-gray-900"> Wins</th>
            <th className="hidden cursor-pointer py-2 px-2 text-right font-semibold text-gray-900 md:table-cell">
              Losses
            </th>
            <th className="cursor-pointer py-2 px-2 text-right font-semibold text-gray-900">
              W<span className="hidden md:inline">in </span>%
            </th>
            <th className="cursor-pointer py-2 pl-2 pr-4 text-right font-semibold text-gray-900 md:pr-2">
              W<span className="hidden md:inline">in Chance</span>
              <span className="md:hidden">C</span>%
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {[...Array(10)].map((_, index) => (
            <tr className="even:bg-gray-100 even:bg-opacity-50" key={index}>
              <td className="py-2 pl-4 pr-2 md:pl-0">
                <SkeletonRow />
              </td>
              <td className="py-2 px-2 text-right">
                <SkeletonRow />
              </td>
              <td className="hidden md:table-cell py-2 px-2 text-right">
                <SkeletonRow />
              </td>
              <td className="py-2 px-2 text-right">
                <SkeletonRow />
              </td>
              <td className="hidden py-2 px-2 text-right md:table-cell">
                <SkeletonRow />
              </td>
              <td className="py-2 px-1 text-right">
                <SkeletonRow />
              </td>
              <td className="py-2 pl-2 pr-4 text-right md:pr-2 ">
                <SkeletonRow />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
