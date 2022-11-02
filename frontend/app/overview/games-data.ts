import axios from "axios";
import { cache } from "react";
import { Play } from "./models";

export const getPlays = cache(async () => {
  console.log("before fetch");
  // const _plays = await fetch(
  //   "https://ewalgamescache.blob.core.windows.net/gamescache/plays-ervwalter.json",
  //   // { cache: "no-store" }
  //   { next: { revalidate: 10 } }
  // );
  const _plays = axios.get<Play[]>(
    "https://ewalgamescache.blob.core.windows.net/gamescache/plays-ervwalter.json"
  );
  console.log("after fetch/before .text()");
  const plays = await (await _plays).data;
  console.log("after .text()");
  return plays;
});
