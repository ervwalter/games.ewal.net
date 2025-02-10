import { Blurb } from "components/blurb";
import { Metadata } from "next";
import { Suspense } from "react";
import OverviewTable from "./overview-table";
import OverviewTableSkeleton from "./overview-table-skeleton";
import RecentPlaysSection from "./recent-plays-section";
import RecentPlaysLoading from "./recent-plays-loading";
import { ErrorBoundary } from "react-error-boundary";
import RecentPlaysError from "./recent-plays-error";

export const runtime = 'edge';
export const preferredRegion = 'auto';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Overview",
};

export default async function Overview() {
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-2xl font-semibold">Overview</h2>
      <Suspense fallback={<OverviewTableSkeleton />}>
        <OverviewTable />
      </Suspense>
      <h2 className="text-2xl font-semibold">Recent Plays</h2>
      <ErrorBoundary FallbackComponent={RecentPlaysError}>
        <Suspense fallback={<RecentPlaysLoading />}>
          <RecentPlaysSection />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
