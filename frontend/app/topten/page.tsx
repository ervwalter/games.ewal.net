import { Blurb } from "components/blurb";
import { getTopTen } from "lib/games-data";
import { Metadata } from "next";
import { TopTenList } from "./topten-list";

export const metadata: Metadata = {
  title: "Top Ten - Board Games",
};

export default async function TopTen() {
  console.log("/topten rendering");
  const topten = await getTopTen();
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-2xl font-semibold">Top 10 Favorite Games</h2>
      <TopTenList topten={topten} />
    </div>
  );
}
