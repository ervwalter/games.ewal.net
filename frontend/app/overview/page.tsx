import OverviewTable from "./overview-table";

// export const revalidate = 10;

export default async function Overview() {
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <div>
        I freely admit that I own too many board games. I have a sizable
        collection of modern/hobby board games, and there are too many that are
        still waiting to be played for the first time. I track the games that I
        own and the games that I play on{" "}
        <a
          href="https://boardgamegeek.com"
          className="link-hover link-primary link"
        >
          BoardGameGeek
        </a>
        , and this page chronicles my addiction.
      </div>
      <h2 className="text-xl font-medium">Overview</h2>
      {/* <Suspense fallback={<OverviewTableSkeleton />}> */}
      {/* @ts-ignore */}
      <OverviewTable />
      {/* </Suspense> */}
    </div>
  );
}