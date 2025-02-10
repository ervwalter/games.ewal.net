import { Blurb } from "components/blurb";
import { getInsights } from "lib/data";
import { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import InsightsCharts from "./charts";
import PlayersTable from "./players-table";
import InsightsError from "./error";
import InsightsLoading from "./loading";

export const runtime = 'edge';
export const preferredRegion = 'auto';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Insights",
};

export default async function InsightsPage() {
  const insights = await getInsights();
  
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-2xl font-semibold">Patterns and Statistics</h2>
      <ErrorBoundary FallbackComponent={InsightsError}>
        <Suspense fallback={<InsightsLoading />}>
          <InsightsCharts insights={insights} />
          <h2 className="text-2xl font-semibold">Player Stats</h2>
          <PlayersTable insights={insights} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
