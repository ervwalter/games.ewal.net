import { getRecentPlays } from "lib/games-data";
import { take, uniqBy } from "lodash";
import { RecentPlaysTable } from "./recent-plays-table";
import { RecentThumbnails } from "./recent-thumbnails";

export default async function RecentPlaysSection() {
  const recentPlays = await getRecentPlays();

  const recentThumbnails = take(
    uniqBy(recentPlays, (p) => p.gameId),
    25
  );

  return (
    <>
      <RecentThumbnails plays={recentThumbnails} />
      <RecentPlaysTable plays={take(recentPlays, 25)} />
    </>
  );
}
