import { getPlays } from "lib/games-data";
import { take, uniqBy } from "lodash";
import { RecentPlaysTable } from "./recent-plays-table";
import { RecentThumbnails } from "./recent-thumbnails";

export default async function RecentPlays() {
  const plays = await getPlays();

  const recentThumbnails = take(
    uniqBy(plays, (p) => p.gameId),
    25
  );

  const recentPlays = take(plays, 25);

  return (
    <>
      <RecentThumbnails plays={recentThumbnails} />
      <RecentPlaysTable plays={recentPlays} />
    </>
  );
}
