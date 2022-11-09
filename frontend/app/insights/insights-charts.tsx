import { schemeBlues, schemeGreens, schemePurples, schemeReds } from "d3-scale-chromatic";
import { Insights } from "lib/insights";
import { sumBy, take } from "lodash";
import { HorizontalBarChart, Pie } from "./charts";

export default function InsightsCharts({ insights }: { insights: Insights }) {
  const locationColors = schemeBlues[9];
  const dayColors = schemeGreens[8];
  const playerCountColors = schemePurples[9];
  const playersColors = schemeReds[9];
  // colors.pop();
  // colors.reverse();

  return (
    <>
      <div className="flex flex-row flex-wrap">
        <div className="flex w-full flex-col p-2 lg:w-1/2 xl:w-1/3">
          <div className="py-4 text-center font-semibold">Plays by Location</div>
          <div className="aspect-w-2 aspect-h-1">
            <Pie colors={locationColors.slice(1)} data={getData(insights.locations, 7, "location")}></Pie>
          </div>
        </div>
        <div className="flex w-full flex-col p-2 lg:w-1/2 xl:w-1/3">
          <div className="py-4 text-center font-semibold">Plays by Day of Week</div>
          <div className="aspect-w-2 aspect-h-1">
            <Pie colors={dayColors.slice(1)} data={getData(insights.daysOfTheWeek, 8, "day")}></Pie>
          </div>
        </div>
        <div className="flex w-full flex-col p-2 lg:w-1/2 xl:w-1/3">
          <div className="py-4 text-center font-semibold">Plays by Player Count</div>
          <div className="aspect-w-2 aspect-h-1">
            <Pie
              colors={playerCountColors.slice(2)}
              data={getData(insights.playerCounts, 6, "players", "6+ players")}></Pie>
          </div>
        </div>
        <div className="flex w-full flex-col p-2 md:pr-[20%]">
          <div className="py-2 pl-20 font-semibold">Plays by Players</div>
          <div className="h-[150px]">
            <HorizontalBarChart
              colors={playersColors.slice(3)}
              data={getData(
                take(
                  insights.statsPerPlayer.filter((p) => p.playerName !== "Erv"),
                  6
                ).reverse(),
                8,
                "playerName"
              )}
              yLabel={"Locations"}></HorizontalBarChart>
          </div>
        </div>
      </div>
    </>
  );
}

function getData<T extends { plays: number }>(
  sourceData: T[],
  max: number,
  key: keyof Omit<T, "plays">,
  otherLabel = "Other"
) {
  const selected: T[] = take(sourceData, max - 1);
  if (sourceData.length == max) {
    selected.push(sourceData[max - 1]);
  }
  const data = selected.map((datum) => ({ id: datum[key] as string, value: datum.plays }));

  if (sourceData.length > max) {
    const other = sumBy(sourceData.slice(max - 1), "plays");
    data.push({ id: otherLabel, value: other });
  }
  return data;
}
