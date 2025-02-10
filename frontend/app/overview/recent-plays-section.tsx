import { ThumbnailList } from "components/thumbnail-list";
import { getRecentPlays } from "lib/data";
import { take, uniqBy } from "lodash-es";
import { RecentPlaysList } from "./recent-plays-list";

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default async function RecentPlaysSection() {
  const recentPlays = await getRecentPlays();

  const recentThumbnails = take(
    uniqBy(recentPlays, (p) => p.gameId),
    25
  );

  return (
    <div className="space-y-4">
      <ThumbnailList thumbnails={recentThumbnails} singleRow={true} />
      <RecentPlaysList plays={take(recentPlays, 25)} />
    </div>
  );
}
