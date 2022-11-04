import { getOverviewStats } from "lib/overview-stats";
import { CollectionStatsBlock } from "./collection-stats-block";
import { PlaysStatsBlock } from "./plays-stats-block";
import { YearStatsBlock } from "./year-stats-block";

export default async function OverviewTable() {
  const { collectionStats, allTimeStats, thisYearStats } =
    await getOverviewStats();
  return (
    <>
      <div className="flex flex-wrap">
        <div className="mb-4 w-full flex-none pr-2 md:mb-0 md:w-1/3">
          <CollectionStatsBlock stats={collectionStats} />
        </div>
        <div className="w-1/2 flex-none pr-2 md:w-1/3">
          <PlaysStatsBlock stats={allTimeStats} />
        </div>
        <div className="w-1/2 flex-none pr-2 md:w-1/3">
          <YearStatsBlock stats={thisYearStats} />
        </div>
      </div>
    </>
  );
}
