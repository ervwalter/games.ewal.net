import { Blurb } from "components/blurb";
import { TopTenListSkeleton } from "./topten-list-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-2xl font-semibold">Top 10 Favorite Games</h2>
      <TopTenListSkeleton />
    </div>
  );
}
