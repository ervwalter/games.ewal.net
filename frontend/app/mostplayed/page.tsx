import { Blurb } from "components/blurb";
import PlayCount from "components/play-count";
import { getPlays } from "lib/games-data";
import { duration } from "lib/plays";
import { groupBy, orderBy, sumBy } from "lodash";
import { Title } from "./title";

export default async function MostPlayed() {
  const plays = await getPlays();
  let games = Object.values(groupBy(plays, (p) => p.gameId))
    .map((group) => {
      return {
        gameId: group[0].gameId,
        name: group[0].name,
        numPlays: sumBy(group, "numPlays"),
        hours: Math.round(sumBy(group, (p) => duration(p)) / 60),
      };
    })
    .filter((g) => g.numPlays >= 5);
  games = orderBy(games, "numPlays", "desc");
  let nickels = 0;
  let dimes = 0;
  let quarters = 0;
  for (const game of games) {
    if (game.numPlays >= 25) {
      quarters++;
    } else if (game.numPlays >= 10) {
      dimes++;
    } else {
      nickels++; // we filters to only game with at least 5 plays are in the array
    }
  }

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <Blurb />
      <Title nickels={nickels} dimes={dimes} quarters={quarters}></Title>
      <Table games={games} />
    </div>
  );
}

interface PlayedGame {
  gameId: string;
  name: string;
  numPlays: number;
  hours: number;
}

function Table({ games }: { games: PlayedGame[] }) {
  return (
    <div className="-mx-4 md:mx-0">
      <table className="min-w-full divide-y divide-gray-300 md:min-w-fit">
        <thead>
          <tr>
            <th className="hidden py-2 px-2 text-center font-semibold text-gray-900 md:table-cell">#</th>
            <th className="py-2 pr-2 pl-4 text-left font-semibold text-gray-900 md:pl-2">Name</th>
            <th className="py-2 px-2 text-left font-semibold text-gray-900">
              <span className="hidden md:inline">Times </span>Played
            </th>
            <th className="py-2 pl-2 pr-4 text-right font-semibold text-gray-900  md:pr-2 md:text-right">
              Hours<span className="hidden md:inline"> Played </span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {games.map((game, index) => (
            <tr
              className={game.numPlays >= 25 ? "bg-quarters" : game.numPlays >= 10 ? "bg-dimes" : "bg-nickels"}
              key={game.gameId}>
              <td className="hidden py-2 px-2 text-center md:table-cell">{index + 1}</td>
              <td className="py-2 pr-2 pl-4 md:pl-2">
                <a
                  href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-hover link-primary link ">
                  {game.name}
                </a>
              </td>
              <td className="py-2 px-2 text-left">
                <PlayCount plays={game.numPlays} />
              </td>
              <td className="py-2 pl-2 pr-4 text-right md:pr-2 md:text-right">≈{game.hours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
