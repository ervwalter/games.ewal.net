import "server-only";

export async function getPlays() {
  const plays = await fetch(
    "https://ewalgamescache.blob.core.windows.net/gamescache/plays-ervwalter.json",
    //    "https://jsonplaceholder.typicode.com/comments",
    { cache: "no-store" }
    // { next: { revalidate: 10 } }
  );
  return await plays.json();
}
