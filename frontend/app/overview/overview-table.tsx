import { getPlays } from "./games-data";

export default async function OverviewTable() {
  const plays = await getPlays();
  return (
    <>
      <div>Found {plays.length + 1} recent plays</div>
      <div>Rendered at {new Date().toTimeString()}</div>
    </>
  );
}
