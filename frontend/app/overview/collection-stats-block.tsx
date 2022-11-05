import { CollectionStats } from "lib/models";

type CollectionStatsBlockProps = {
  stats: CollectionStats;
};

export const CollectionStatsBlock = ({ stats }: CollectionStatsBlockProps) => {
  return (
    <>
      <div>
        <small>COLLECTION</small>
      </div>
      <div>
        <b>{stats.numberOfGames}</b> games
        <span className="hidden lg:inline"> owned</span>
      </div>
      <div>
        <b>{stats.numberOfExpansions}</b> expansions
        <span className="hidden lg:inline"> owned</span>
      </div>
      <div>
        <b>{stats.numberOfPreviouslyOwned}</b> prev
        <span className="hidden lg:inline">iously</span> owned
        <span className="hidden lg:inline"> games</span>
      </div>
      <div>
        <b>{stats.yetToBePlayed}</b> <span className="lg:hidden">unplayed</span>
        <span className="hidden lg:inline">games yet to be played</span>
      </div>
      <div>
        <b>{stats.top100Games}</b> <span className="hidden lg:inline">games from the </span> top 100
      </div>
      <div>
        <b>{stats.averageRating.toFixed(1)}</b> average rating
      </div>
    </>
  );
};
