import { getStats } from "lib/games-data";
import { CollectionStatsBlock } from "./collection-stats-block";
import { PlaysStatsBlock } from "./plays-stats-block";
import { YearStatsBlock } from "./year-stats-block";

export default async function OverviewTable() {
  const { collection, playsAllTime, playsThisYear, thisYear } = await getStats();
  return (
    <>
      <div className="flex flex-wrap">
        <div className="mb-4 w-full flex-none pr-2 md:mb-0 md:w-1/3">
          <CollectionStatsBlock stats={collection} />
        </div>
        <div className="w-1/2 flex-none pr-2 md:w-1/3">
          <PlaysStatsBlock stats={playsAllTime} />
        </div>
        <div className="w-1/2 flex-none pr-2 md:w-1/3">
          <YearStatsBlock stats={playsThisYear} year={thisYear} />
        </div>
      </div>
    </>
  );
}
