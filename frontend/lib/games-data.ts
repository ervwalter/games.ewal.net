import { orderBy } from "lodash";
import { get } from "./fetch";
import { Game, Play, Stats, TopTenItem } from "./models";

export async function getPlays() {
  let plays = await get<Play[]>("https://ewalgamescache.blob.core.windows.net/gamescache/plays-ervwalter.json", {
    cache: "no-store",
  });
  plays = orderBy(plays, ["playDate", "playId"], ["desc", "desc"]);
  return plays;
}

export async function getRecentPlays() {
  let plays = await get<Play[]>("https://ewalgamescache.blob.core.windows.net/gamescache/recent-plays-ervwalter.json", {
    cache: "no-store",
  });
  plays = orderBy(plays, ["playDate", "playId"], ["desc", "desc"]);
  return plays;
}

export async function getCollection() {
  const games = await get<Game[]>("https://ewalgamescache.blob.core.windows.net/gamescache/collection-ervwalter.json", {
    cache: "no-store",
  });
  return games;
}

export async function getTopTen() {
  const topten = await get<TopTenItem[]>(
    "https://ewalgamescache.blob.core.windows.net/gamescache/top10-ervwalter.json",
    { cache: "no-store" }
  );
  return topten;
}

export async function getStats() {
  const stats = await get<Stats>("https://ewalgamescache.blob.core.windows.net/gamescache/stats-ervwalter.json", {
    cache: "no-store",
  });
  return stats;
}
