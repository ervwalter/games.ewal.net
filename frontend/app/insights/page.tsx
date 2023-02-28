import { Blurb } from "components/blurb";
import { getInsights } from "lib/insights";
import { Metadata } from "next";
import InsightsCharts from "./charts";
import PlayersTable from "./players-table";

export const metadata: Metadata = {
  title: "Insights - Board Games",
};

export default async function InsightsPage() {
  console.log("/insights rendering");
  const insights = await getInsights();
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-2xl font-semibold">Patterns and Statistics</h2>
      <InsightsCharts insights={insights} />
      <h2 className="text-2xl font-semibold">Player Stats</h2>
      <PlayersTable insights={insights} />
    </div>
  );
}
