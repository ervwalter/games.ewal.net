import { Blurb } from "components/blurb";
import { getCollection } from "lib/data";
import { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import CollectionTable from "./collection-table";
import CollectionError from "./error";
import CollectionLoading from "./loading";

export const runtime = 'edge';
export const preferredRegion = 'auto';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Collection",
};

export default async function Collection() {
  const collection = await getCollection();
  const owned = collection.filter((g) => g.owned);

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-2xl font-semibold">Game Collection</h2>
      <ErrorBoundary FallbackComponent={CollectionError}>
        <Suspense fallback={<CollectionLoading />}>
          <CollectionTable collection={owned} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
