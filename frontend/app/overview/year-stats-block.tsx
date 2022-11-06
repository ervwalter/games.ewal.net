import { PlayStats } from "lib/models";

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
        <b>{stats.numberOfPlays}</b> plays
      </div>
      <div>
        <b>{stats.uniqueGames}</b> unique games
      </div>
      <div>
        <b>{stats.namedPlayers}</b>
        <span className="hidden lg:inline"> different</span> players
      </div>
      <div>
        <b>{stats.locations}</b>
        <span className="hidden lg:inline"> different</span> locations
      </div>
      <div>
        <b>{stats.newGames}</b> new games
      </div>
      <div>
        <b>≈{stats.hoursPlayed.toLocaleString()}</b> hours
        <span className="hidden lg:inline"> played</span>
      </div>
    </>
  );
};
