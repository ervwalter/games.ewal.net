import { Blurb } from "components/blurb";
import { getTopTen } from "lib/data";
import { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { TopTenList } from "./topten-list";
import TopTenError from "./error";
import TopTenLoading from "./loading";

export const runtime = 'edge';
export const preferredRegion = 'auto';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Top Ten",
};

export default async function TopTen() {
  const topten = await getTopTen();
  
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-2xl font-semibold">Top 10 Favorite Games</h2>
      <ErrorBoundary FallbackComponent={TopTenError}>
        <Suspense fallback={<TopTenLoading />}>
          <TopTenList topten={topten} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
