import { get } from "./fetch";
import { Play } from "./models";

export async function getPlays() {
  return await get<Play[]>(
    "https://ewalgamescache.blob.core.windows.net/gamescache/plays-ervwalter.json"
  );
}
