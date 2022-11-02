import "server-only";
import { Play } from "./models";

export async function getPlays() {
  const plays = await fetch(
    "https://ewalgamescache.blob.core.windows.net/gamescache/recent-plays-ervwalter.json",
    { cache: "no-store" }
    // { next: { revalidate: 10 } }
  );
  return plays.json() as Promise<Play[]>;
}
