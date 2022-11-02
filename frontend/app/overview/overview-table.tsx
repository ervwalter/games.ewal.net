import { getOverviewStats } from "lib/overview-stats";

export default async function OverviewTable() {
  const stats = await getOverviewStats();
  return (
    <>
      <pre>
        <code>{JSON.stringify(stats, undefined, 2)}</code>
      </pre>
    </>
  );
}
