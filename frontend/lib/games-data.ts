export async function getPlays() {
  console.log("before fetch");
  const _plays = await fetch(
    "https://ewalgamescache.blob.core.windows.net/gamescache/plays-ervwalter.json",
    //    "https://jsonplaceholder.typicode.com/comments",
    { cache: "no-store" }
    // { next: { revalidate: 10 } }
  );
  console.log("after fetch/before .text()");
  const plays = await _plays.text();
  console.log("after .text()");
  return plays;
}
