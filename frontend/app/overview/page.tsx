import { Suspense } from "react";
import OverviewTable from "./overview-table";
import OverviewTableSkeleton from "./overview-table-skeleton";
import RecentPlaysSection from "./recent-plays-section";
import RecentPlaysSectionSkeleton from "./recent-plays-section-skeleton";

// // workaround until fetch() works with large requests
// export const dynamic = "auto",
//   dynamicParams = true,
//   revalidate = 60,
//   fetchCache = "auto",
//   runtime = "nodejs",
//   preferredRegion = "auto";

export default async function Overview() {
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <div>
        I have a sizable collection of modern/hobby board games—too many really. I freely admit I have a bit of a
        problem. In any case, I track the games that I own and that I play on{" "}
        <a href="https://boardgamegeek.com" className="link-hover link-primary link">
          BoardGameGeek
        </a>
        , and this page chronicles my addiction.
      </div>
      <h2 className="text-xl font-medium">Overview</h2>
      <Suspense fallback={<OverviewTableSkeleton />}>
        {/* @ts-expect-error: typescript isn't updated yet to allow async server components */}
        <OverviewTable />
      </Suspense>
      <h2 className="text-xl font-medium">Recent Plays</h2>
      <Suspense fallback={<RecentPlaysSectionSkeleton />}>
        {/* @ts-expect-error: typescript isn't updated yet to allow async server components */}
        <RecentPlaysSection />
      </Suspense>
    </div>
  );
}
