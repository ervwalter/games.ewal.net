import { Blurb } from "components/blurb";
import { SkeletonRow, SkeletonWrapper } from "components/skeleton";
import { Title } from "./title";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <Title />

      <SkeletonWrapper className="-mx-4 md:mx-0">
        <table className="min-w-full divide-y divide-gray-300 md:min-w-fit">
          <thead>
            <tr>
              <th className="hidden py-2 px-2 text-center font-semibold text-gray-900 md:table-cell">#</th>
              <th className="py-2 pr-2 pl-4 text-left font-semibold text-gray-900 md:pl-2">Name</th>
              <th className="py-2 px-2 text-left font-semibold text-gray-900">
                <span className="hidden md:inline">Times </span>Played
              </th>
              <th className="py-2 pl-2 pr-4 text-right font-semibold text-gray-900  md:pr-2 md:text-right">
                Hours<span className="hidden md:inline"> Played </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[...Array(15)].map((_, index) => (
              <tr key={index}>
                <td className="hidden w-[50px] py-2 px-2 text-center md:table-cell">
                  <SkeletonRow />
                </td>
                <td className="w-[400px] py-2 pr-2 pl-4 md:pl-2">
                  <SkeletonRow />
                </td>
                <td className="w-[90px] py-2 px-2 text-left md:w-[130px]">
                  <SkeletonRow />
                </td>
                <td className="w-[80px] py-2 pl-2 pr-4 text-right md:w-[130px] md:pr-2 md:text-right">
                  <SkeletonRow />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SkeletonWrapper>
    </div>
  );
}
