import { Blurb } from "components/blurb";
import { durationForPlay, getPlays } from "lib/data";
import { groupBy, orderBy, sumBy } from "lodash-es";
import { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MostPlaysTable } from "./most-plays-table";
import { Title } from "./title";
import MostPlayedError from "./error";
import MostPlayedLoading from "./loading";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Most Played",
};

export default async function MostPlayed() {
  const plays = await getPlays();
  let games = Object.values(groupBy(plays, (p) => p.gameId))
    .map((group) => {
      return {
        gameId: group[0].gameId,
        name: group[0].name,
        sortableName: group[0].sortableName,
        numPlays: sumBy(group, "numPlays"),
        hours: Math.round(sumBy(group, (p) => durationForPlay(p)) / 60),
      };
    })
    .filter((g) => g.numPlays >= 5);
  games = orderBy(games, ["numPlays", "sortableName"], ["desc", "asc"]);
  
  let nickels = 0;
  let dimes = 0;
  let quarters = 0;
  for (const game of games) {
    if (game.numPlays >= 25) {
      quarters++;
    } else if (game.numPlays >= 10) {
      dimes++;
    } else {
      nickels++; // we filtered to only games with at least 5 plays
    }
  }

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <Title nickels={nickels} dimes={dimes} quarters={quarters} />
      <ErrorBoundary FallbackComponent={MostPlayedError}>
        <Suspense fallback={<MostPlayedLoading />}>
          <MostPlaysTable games={games} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
