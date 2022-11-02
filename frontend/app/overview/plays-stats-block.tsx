import { PlayStats } from "lib/models";

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
        <b>{stats.numberOfPlays}</b> plays
      </div>
      <div>
        <b>{stats.uniqueGames}</b> unique games
      </div>
      <div>
        <b>≈{stats.hoursPlayed.toLocaleString()}</b> hours
        <span className="hidden lg:inline"> played</span>
      </div>
      <div>
        <b>{stats.nickles}</b> nickles
        <span className="hidden lg:inline"> (5+ plays)</span>
      </div>
      <div>
        <b>{stats.dimes}</b> dimes
        <span className="hidden lg:inline"> (10+ plays)</span>
      </div>
      <div>
        <b>{stats.quarters}</b> quarters
        <span className="hidden lg:inline"> (25+ plays)</span>
      </div>
    </>
  );
};
