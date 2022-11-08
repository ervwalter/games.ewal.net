import { Blurb } from "components/blurb";
import { getCollection } from "lib/games-data";
import CollectionTable from "./collection-table";

export default async function Collection() {
  const collection = await getCollection();
  const owned = collection.filter((g) => g.owned);
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-xl font-semibold">Game Collection</h2>
      <CollectionTable collection={owned} />
    </div>
  );
}
