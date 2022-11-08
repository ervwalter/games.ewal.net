import { PlayStats } from "lib/games-interfaces";

type YearStatsBlockProps = {
  stats: PlayStats;
  year: number;
};

export const YearStatsBlock = ({ stats, year }: YearStatsBlockProps) => {
  return (
    <>
      <div>
        <small>{year} YEAR TO DATE</small>
      </div>
      <div>
        <b className="font-semibold">{stats.numberOfPlays}</b> plays
      </div>
      <div>
        <b className="font-semibold">{stats.uniqueGames}</b> unique games
      </div>
      <div>
        <b className="font-semibold">{stats.namedPlayers}</b>
        <span className="hidden lg:inline"> different</span> players
      </div>
      <div>
        <b className="font-semibold">{stats.locations}</b>
        <span className="hidden lg:inline"> different</span> locations
      </div>
      <div>
        <b className="font-semibold">{stats.newGames}</b> new games
      </div>
      <div>
        <b className="font-semibold">≈{stats.hoursPlayed.toLocaleString()}</b> hours
        <span className="hidden lg:inline"> played</span>
      </div>
    </>
  );
};
