import { Blurb } from "components/blurb";

export default function Insights() {
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-xl font-semibold">Top 10 Favorite Games</h2>
    </div>
  );
}
