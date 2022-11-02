import { getPlays } from "lib/games-data";

export default async function RecentPlays() {
  const plays = await getPlays();
  return (
    <>
      <div>Found {plays.length} recorded plays</div>
    </>
  );
}
