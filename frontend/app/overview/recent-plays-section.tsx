import { getRecentPlays } from "lib/games-data";
import { take, uniqBy } from "lodash";
import { RecentPlaysList } from "./recent-plays-list";
import { RecentPlaysThumbnails } from "./recent-plays-thumbnails";

export default async function RecentPlaysSection() {
  const recentPlays = await getRecentPlays();

  const recentThumbnails = take(
    uniqBy(recentPlays, (p) => p.gameId),
    25
  );

  return (
    <>
      <RecentPlaysThumbnails plays={recentThumbnails} />
      <RecentPlaysList plays={take(recentPlays, 25)} />
    </>
  );
}
