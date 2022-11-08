import { Blurb } from "components/blurb";
import { SkeletonRow, SkeletonWrapper } from "components/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-xl font-semibold">Game Collection</h2>
      <div className="-mx-4 md:mx-0">
        <SkeletonWrapper>
          <table className="min-w-full divide-y divide-gray-300 md:min-w-fit md:max-w-full">
            <thead>
              <tr>
                <th className="w-full py-2 pr-2 pl-4 text-left font-semibold text-gray-900 md:w-[550px] md:pl-2">
                  Name
                </th>
                <th className="w-[8em] py-2 px-2 text-left font-semibold text-gray-900">
                  <span className="hidden md:inline">Times </span>Played
                </th>
                <th className="w-[12em] py-2 pl-2 pr-4 text-left font-semibold text-gray-900 md:pr-2">
                  <span className="hidden md:inline">My </span>Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(25)].map((_, index) => (
                <tr className="even:bg-gray-50" key={index}>
                  <td className="py-2 pl-4 pr-2 md:pl-2">
                    <SkeletonRow />
                  </td>
                  <td className="py-2 px-2 text-center md:text-left">
                    <SkeletonRow />
                  </td>
                  <td className="py-2 pl-2 pr-4 text-center md:pr-2 md:text-left">
                    <SkeletonRow />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SkeletonWrapper>
      </div>
    </div>
  );
}
