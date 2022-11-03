import clsx from "clsx";
import dayjs from "dayjs";
import { Play, Player } from "lib/models";
import { orderBy, remove } from "lodash";

type RecentPlaysTableProps = {
  plays: Play[];
};

export const RecentPlaysTable = ({ plays }: RecentPlaysTableProps) => {
  // const { width } = useViewportSize();

  // if (width === 0) {
  //   return null;
  // } else if (width >= 1024) {
  return <RecentPlaysTableWide plays={plays} />;
  // } else {
  //   return <div>Narrow</div>;
  // }
};

export const RecentPlaysTableWide = ({ plays }: RecentPlaysTableProps) => {
  return (
    <div>
      <table className="min-w-full divide-y divide-gray-300 md:min-w-fit">
        <thead>
          <tr>
            <th className="py-3 pr-2 pl-0 text-left font-semibold text-gray-900">
              Date
            </th>
            <th className="py-3 px-2 text-left font-semibold text-gray-900">
              Game
            </th>
            <th className="py-3 px-2 text-left font-semibold text-gray-900">
              Players
            </th>
            <th className="py-3 pl-2 text-left font-semibold text-gray-900">
              Location
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {plays.map((play) => (
            <TableRow play={play} key={play.playId} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

type TableRowProps = {
  play: Play;
};

const TableRow = ({ play }: TableRowProps) => {
  return (
    <tr className="even:bg-gray-50">
      <td className="whitespace-nowrap py-3 pl-0 pr-2">
        {dayjs(play.playDate).format("ddd, MMM D")}
      </td>
      <td className="py-3 px-2">
        <a
          href={`https://boardgamegeek.com/boardgame/${play.gameId}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="link-hover link-primary link "
        >
          {play.name}
        </a>
      </td>
      <td className="py-3 px-2">
        <Players players={play.players} />
      </td>
      <td className="py-3 px-2">{play.location}</td>
    </tr>
  );
};

type PlayersProps = {
  players: Player[];
};

const Players = ({ players }: PlayersProps) => {
  players = orderBy(players, "name");

  // the following line actually removes the elements from the array, and doesn't just count them
  const anonymousCount = remove(
    players,
    (p) => p.name.toLowerCase() === "anonymous player"
  ).length;

  if (anonymousCount > 0) {
    players.push({
      name: `and ${anonymousCount} other${anonymousCount > 1 ? "s" : ""}`,
      new: false,
      win: false,
    });
  }

  const playerCount = players.length;
  return (
    <div className="">
      {players.map((player, index) => (
        <span className="" key={player.name}>
          <span
            className={clsx(
              {
                "after:not-italic after:opacity-80 after:content-['🏅']":
                  player.win,
              },
              { italic: player.new }
            )}
            title={clsx(player.win && "Winner!", player.new && "New!")}
          >
            {player.name}
          </span>
          {index < playerCount - 1 && <span>,&nbsp;</span>}
        </span>
      ))}
    </div>
  );
};
