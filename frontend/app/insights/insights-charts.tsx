import { schemeBlues as scheme } from "d3-scale-chromatic";
import { Insights } from "lib/insights";
import { sumBy, take } from "lodash";
import { Pie } from "./charts";

export default function InsightsCharts({ insights }: { insights: Insights }) {
  const colors = scheme[9];
  // colors.pop();
  // colors.reverse();

  return (
    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
      <div className="flex flex-col items-center rounded  border-gray-200 p-2">
        <div className="h-[150px] w-full">
          <Pie colors={colors.slice(1)} data={getData(insights.locations, 7, "location")}></Pie>
        </div>
        <div className="text-lg font-semibold">Locations</div>
      </div>
      <div className="flex flex-col items-center rounded  border-gray-200 p-2">
        <div className="h-[150px] w-full">
          <Pie colors={colors.slice(2)} data={getData(insights.playerCounts, 5, "players")}></Pie>
        </div>
        <div className="text-lg font-semibold">Player Count</div>
      </div>
      <div className="flex flex-col items-center rounded  border-gray-200 p-2">
        <div className="h-[150px] w-full">
          <Pie colors={colors.slice(1)} data={getData(insights.daysOfTheWeek, 8, "day")}></Pie>
        </div>
        <div className="text-lg font-semibold">Days of the Week</div>
      </div>
    </div>
  );
}

function getData<T extends { plays: number }>(sourceData: T[], max: number, key: keyof Omit<T, "plays">) {
  const selected: T[] = take(sourceData, max - 1);
  if (sourceData.length == max) {
    selected.push(sourceData[max - 1]);
  }
  const data = selected.map((datum) => ({ id: datum[key] as string, value: datum.plays }));

  if (sourceData.length > max) {
    const other = sumBy(sourceData.slice(max - 1), "plays");
    data.push({ id: "Other", value: other });
  }
  return data;
}
