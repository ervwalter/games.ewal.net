import { Blurb } from "components/blurb";
import { getCollection } from "lib/games-data";
import { Metadata } from "next";
import CollectionTable from "./collection-table";

export const metadata: Metadata = {
  title: "Collection - Board Games",
};

export default async function Collection() {
  console.log("/collection rendering");
  const collection = await getCollection();
  const owned = collection.filter((g) => g.owned);
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-2xl font-semibold">Game Collection</h2>
      <CollectionTable collection={owned} />
    </div>
  );
}
