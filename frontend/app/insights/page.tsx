import { Blurb } from "components/blurb";
import { getInsights } from "lib/insights";
import InsightsCharts from "./insights-charts";

export default async function InsightsPage() {
  const insights = await getInsights();
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-2xl font-semibold">Insights</h2>
      <InsightsCharts insights={insights} />
      {/* <PlayersInsights insights={insights} /> */}
    </div>
  );
}
