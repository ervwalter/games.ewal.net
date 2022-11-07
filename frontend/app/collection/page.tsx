import { getCollection } from "lib/games-data";
import CollectionTable from "./collection-table";

export default async function Collection() {
  const collection = await getCollection();
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <h2 className="text-xl font-semibold">Game Collection</h2>
      <CollectionTable collection={collection} />
    </div>
  );
}
