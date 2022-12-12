import { Blurb } from "components/blurb";
import { Suspense } from "react";
import OverviewTable from "./overview-table";
import OverviewTableSkeleton from "./overview-table-skeleton";
import RecentPlaysSection from "./recent-plays-section";
import RecentPlaysSectionSkeleton from "./recent-plays-section-skeleton";

export default async function Overview() {
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-2xl font-semibold">Overview</h2>
      <Suspense fallback={<OverviewTableSkeleton />}>
        {/* @ts-expect-error: typescript isn't updated yet to allow async server components */}
        <OverviewTable />
      </Suspense>
      <h2 className="text-2xl font-semibold">Recent Plays</h2>
      <Suspense fallback={<RecentPlaysSectionSkeleton />}>
        {/* @ts-expect-error: typescript isn't updated yet to allow async server components */}
        <RecentPlaysSection />
      </Suspense>
    </div>
  );
}
