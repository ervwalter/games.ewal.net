import clsx from "clsx";
import dayjs from "dayjs";
import { Play, Player } from "lib/games-interfaces";
import { orderBy, remove } from "lodash-es";

type RecentPlaysProps = {
  plays: Play[];
};

export const RecentPlaysList = ({ plays }: RecentPlaysProps) => {
  return (
    <>
      <RecentPlaysNarrow plays={plays} />
      <RecentPlaysWide plays={plays} />
    </>
  );
};

const RecentPlaysNarrow = ({ plays }: RecentPlaysProps) => {
  return (
    <div className="-mx-4 border-t border-gray-200 md:hidden">
      {plays.map((play) => (
        <div className="border-b border-gray-200 px-4 py-2 odd:bg-gray-100 odd:bg-opacity-50" key={play.playId}>
          <div className="flex flex-row">
            <div className="flex-1">
              <a
                href={`https://boardgamegeek.com/boardgame/${play.gameId}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-focus hover:underline">
                {play.name}
              </a>
            </div>
            <div className="flex-none">{dayjs(play.playDate).format("MMM D")}</div>
          </div>
          <div>
            <Players players={play.players} />- @{play.location || "Home"}
          </div>
        </div>
      ))}
    </div>
  );
};

const RecentPlaysWide = ({ plays }: RecentPlaysProps) => {
  return (
    <div className="hidden md:block">
      <table className="min-w-full divide-y divide-gray-300 md:min-w-fit">
        <thead>
          <tr>
            <th className="py-3 px-2 text-left font-semibold text-gray-900 md:pl-0">Date</th>
            <th className="py-3 px-2 text-left font-semibold text-gray-900">Game</th>
            <th className="py-3 px-2 text-left font-semibold text-gray-900">Players</th>
            <th className="py-3 px-2 text-left font-semibold text-gray-900 md:pr-0">Location</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {plays.map((play) => (
            <tr className="even:bg-gray-100 even:bg-opacity-50" key={play.playId}>
              <td className="whitespace-nowrap py-3 px-2 md:pl-0">{dayjs(play.playDate).format("ddd, MMM D")}</td>
              <td className="py-3 px-2">
                <a
                  href={`https://boardgamegeek.com/boardgame/${play.gameId}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary-focus hover:underline">
                  {play.name}
                </a>
              </td>
              <td className="py-3 px-2">
                <Players players={play.players} />
              </td>
              <td className="py-3 px-2">{play.location || "Home"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

type PlayersProps = {
  players: Player[];
};

const Players = ({ players }: PlayersProps) => {
  players = orderBy(players, "name");

  // the following line actually removes the elements from the array, and doesn't just count them
  const anonymousCount = remove(players, (p) => p.name.toLowerCase() === "anonymous player").length;

  if (anonymousCount > 0) {
    players.push({
      name: `and ${anonymousCount} other${anonymousCount > 1 ? "s" : ""}`,
      new: false,
      win: false,
    });
  }

  const playerCount = players.length;
  return (
    <div className="inline-block">
      {players.map((player, index) => (
        <span className="" key={player.name}>
          <span
            className={clsx(
              {
                "font-semibold after:not-italic after:opacity-80 after:content-['🏅']": player.win,
              },
              { italic: player.new }
            )}
            title={clsx(player.win && "Winner!", player.new && "New!")}>
            {player.name}
          </span>
          {index < playerCount - 1 && <span>,&nbsp;</span>}
        </span>
      ))}
    </div>
  );
};
