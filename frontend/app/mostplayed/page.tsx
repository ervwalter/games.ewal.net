import { Blurb } from "components/blurb";

export default function MostPlayed() {
  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <h2 className="text-xl font-semibold">Most Played Games</h2>
    </div>
  );
}
