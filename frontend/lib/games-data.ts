import { orderBy } from "lodash-es";
import { get } from "./fetch";
import { Game, Play, Stats, TopTenItem } from "./games-interfaces";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getPlays() {
  let plays = await get<Play[]>("https://ewalgamescache.blob.core.windows.net/gamescache/plays-ervwalter.json", {
    next: { revalidate: 60 },
  });
  plays = orderBy(plays, ["playDate", "playId"], ["desc", "desc"]);
  await delay(2000);
  return plays;
}

export async function getRecentPlays() {
  let plays = await get<Play[]>("https://ewalgamescache.blob.core.windows.net/gamescache/recent-plays-ervwalter.json", {
    next: { revalidate: 60 },
  });
  plays = orderBy(plays, ["playDate", "playId"], ["desc", "desc"]);
  return plays;
}

export async function getCollection() {
  const games = await get<Game[]>("https://ewalgamescache.blob.core.windows.net/gamescache/collection-ervwalter.json", {
    next: { revalidate: 60 },
  });
  return games;
}

export async function getTopTen() {
  const topten = await get<TopTenItem[]>(
    "https://ewalgamescache.blob.core.windows.net/gamescache/top10-ervwalter.json",
    { next: { revalidate: 60 } }
  );
  return topten;
}

export async function getStats() {
  const stats = await get<Stats>("https://ewalgamescache.blob.core.windows.net/gamescache/stats-ervwalter.json", {
    next: { revalidate: 60 },
  });
  return stats;
}

export function durationForPlay(play: Play): number {
  if (play.duration && play.duration > 0) {
    return play.duration;
  } else if (play.estimatedDuration && play.estimatedDuration > 0) {
    // use the estimated duration of an explicit one was not specified
    return play.estimatedDuration * play.numPlays;
  }
  return 0;
}
