import { Blurb } from "components/blurb";
import { getCollection } from "lib/data";
import { Metadata } from "next";
import { Suspense, use } from "react";
import CollectionTable from "./collection-table";
import CollectionLoading from "./loading";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Collection",
  description: "My board game collection",
};

// Create a promise for data fetching
async function getCollectionData() {
  const collection = await getCollection();
  return collection.filter((g) => g.owned);
}

export default function Collection() {
  // Use the new 'use' hook for data fetching
  const owned = use(getCollectionData());

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-2xl font-semibold">Game Collection</h2>
      <Suspense fallback={<CollectionLoading />}>
        <CollectionTable collection={owned} />
      </Suspense>
    </div>
  );
}
