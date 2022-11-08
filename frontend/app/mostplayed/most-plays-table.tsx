import PlayCount from "components/play-count";

interface PlayedGame {
  gameId: string;
  name: string;
  numPlays: number;
  hours: number;
}

export function MostPlaysTable({ games }: { games: PlayedGame[] }) {
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
