import { Blurb } from "components/blurb";
import { Metadata } from "next";
import { Suspense } from "react";
import OverviewTable from "./overview-table";
import OverviewTableSkeleton from "./overview-table-skeleton";
import RecentPlaysSection from "./recent-plays-section";
import RecentPlaysLoading from "./recent-plays-loading";

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
      <Suspense fallback={<RecentPlaysLoading />}>
        <RecentPlaysSection />
      </Suspense>
    </div>
  );
}
