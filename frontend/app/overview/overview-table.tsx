import { getPlays } from "lib/games-data";

export default async function OverviewTable() {
  const plays = await getPlays();
  return <div>Found {plays.length + 1} recorded plays</div>;
}
