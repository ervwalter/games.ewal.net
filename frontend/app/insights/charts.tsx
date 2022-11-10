import { schemeBlues, schemeGreens, schemeOranges, schemePurples } from "d3-scale-chromatic";
import { Insights } from "lib/insights";
import { sumBy, take } from "lodash";
import { HorizontalBarChart, PieChart } from "../../components/charts";

export default function InsightsCharts({ insights }: { insights: Insights }) {
  const locationColors = schemeBlues[9];
  const dayColors = schemeGreens[8];
  const playerCountColors = schemePurples[9];
  const playersColors = schemeBlues[9];
  const durationsColors = schemeOranges[9];

  return (
    <div className="flex flex-row flex-wrap items-center justify-start gap-4">
      <div className="flex w-full max-w-[350px] flex-col  ">
        <div className="text-center font-semibold">Plays by Location</div>
        <div className="aspect-w-2 aspect-h-1">
          <PieChart colors={locationColors.slice(1)} data={getData(insights.locations, 7, "location")}></PieChart>
        </div>
      </div>
      <div className="flex w-full max-w-[350px] flex-col  ">
        <div className="text-center font-semibold">Plays by Day of Week</div>
        <div className="aspect-w-2 aspect-h-1">
          <PieChart colors={dayColors.slice(1)} data={getData(insights.daysOfTheWeek, 8, "day")}></PieChart>
        </div>
      </div>
      <div className="flex w-full max-w-[350px] flex-col  ">
        <div className="text-center font-semibold">Plays by Player Count</div>
        <div className="aspect-w-2 aspect-h-1">
          <PieChart
            colors={playerCountColors.slice(2)}
            data={getData(insights.playerCounts, 6, "players", "6+ players")}></PieChart>
        </div>
      </div>
      <div className="flex w-full max-w-[350px] flex-col  ">
        <div className="text-center font-semibold">Plays by Duration</div>
        <div className="aspect-w-2 aspect-h-1">
          <PieChart colors={durationsColors.slice(2)} data={getData(insights.durations, 8, "bucket")}></PieChart>
        </div>
      </div>
      <div className="flex w-full max-w-[600px] flex-col pb-4">
        <div className="pb-2 text-center font-semibold">Most Frequent Players</div>
        <div className="h-[250px]">
          <HorizontalBarChart
            colors={playersColors.slice().reverse().slice(2)}
            data={getData(
              take(
                insights.statsPerPlayer.filter((p) => p.playerName !== "Erv"),
                10
              ).reverse(),
              10,
              "playerName"
            )}
            axisLabel={"Locations"}
            showLabels={false}></HorizontalBarChart>
        </div>
      </div>
    </div>
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
