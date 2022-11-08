import { Blurb } from "components/blurb";
import { getTopTen } from "lib/games-data";
import { TopTenList } from "./topten-list";

export default async function TopTen() {
  const topten = await getTopTen();
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-xl font-semibold">Top 10 Favorite Games</h2>
      <TopTenList topten={topten} />
    </div>
  );
}
