import { ThumbnailList } from "components/thumbnail-list";
import { getRecentPlays } from "lib/games-data";
import { take, uniqBy } from "lodash-es";
import { RecentPlaysList } from "./recent-plays-list";

export default async function RecentPlaysSection() {
  const recentPlays = await getRecentPlays();

  const recentThumbnails = take(
    uniqBy(recentPlays, (p) => p.gameId),
    25
  );

  return (
    <>
      <ThumbnailList thumbnails={recentThumbnails} singleRow={true} />
      <RecentPlaysList plays={take(recentPlays, 25)} />
    </>
  );
}
