import { cache } from "react";
import { request } from "undici";
import { Play } from "./models";

// const _plays = await fetch(
//   "https://ewalgamescache.blob.core.windows.net/gamescache/plays-ervwalter.json",
//   // { cache: "no-store" }
//   { next: { revalidate: 10 } }
// );

export const getPlays = cache(async () => {
  const { body } = await request(
    "https://ewalgamescache.blob.core.windows.net/gamescache/plays-ervwalter.json"
  );
  const plays = (await body.json()) as Play[];
  return plays;
});
