import { orderBy } from "lodash";
import { get } from "./fetch";
import { Game, Play, TopTenItem } from "./models";

export async function getPlays() {
  let plays = await get<Play[]>(
    "https://ewalgamescache.blob.core.windows.net/gamescache/plays-ervwalter.json",
    { next: { revalidate: 60 } }
  );
  plays = orderBy(plays, ["playDate", "playId"], ["desc", "desc"]);
  for (const play of plays) {
    if (!play.location || play.location === "") {
      play.location = "Home"; // default to Home if I forgot to log the location
    }
  }
  return plays;
}

export async function getCollection() {
  const games = await get<Game[]>(
    "https://ewalgamescache.blob.core.windows.net/gamescache/collection-ervwalter.json",
    { next: { revalidate: 60 } }
  );
  for (const game of games) {
    if (!game.rating || !(game.rating > 0)) {
      game.rating = 0;
    }
    game.ownedExpansionCount = 0;
    if (game.expansions) {
      game.allExpansions = game.expansions;
      game.expansions = game.expansions.filter((g) => g.owned);
      game.ownedExpansionCount = game.expansions.length;
    }
  }
  return games;
}

export async function getTopTen() {
  const topten = await get<TopTenItem[]>(
    "https://ewalgamescache.blob.core.windows.net/gamescache/top10-ervwalter.json",
    { next: { revalidate: 60 } }
  );
  for (const game of topten) {
    if (!game.rating || !(game.rating > 0)) {
      game.rating = 0;
    }
  }
  return topten;
}
