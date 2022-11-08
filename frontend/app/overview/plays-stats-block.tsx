import { PlayStats } from "lib/games-interfaces";

type PlaysStatsBlockProps = {
  stats: PlayStats;
};

export const PlaysStatsBlock = ({ stats }: PlaysStatsBlockProps) => {
  return (
    <>
      <div>
        <small>PLAYS</small>
      </div>
      <div>
        <b className="font-semibold">{stats.numberOfPlays}</b> plays
      </div>
      <div>
        <b className="font-semibold">{stats.uniqueGames}</b> unique games
      </div>
      <div>
        <b className="font-semibold">≈{stats.hoursPlayed.toLocaleString()}</b> hours
        <span className="hidden lg:inline"> played</span>
      </div>
      <div>
        <b className="font-semibold">{stats.nickles}</b> nickles
        <span className="hidden lg:inline"> (5+ plays)</span>
      </div>
      <div>
        <b className="font-semibold">{stats.dimes}</b> dimes
        <span className="hidden lg:inline"> (10+ plays)</span>
      </div>
      <div>
        <b className="font-semibold">{stats.quarters}</b> quarters
        <span className="hidden lg:inline"> (25+ plays)</span>
      </div>
    </>
  );
};
