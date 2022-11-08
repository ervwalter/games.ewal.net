import { CollectionStats } from "lib/games-interfaces";

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
        <b className="font-semibold">{stats.numberOfGames}</b> games
        <span className="md:hidden lg:inline"> owned</span>
      </div>
      <div>
        <b className="font-semibold">{stats.numberOfExpansions}</b> expansions
        <span className="md:hidden lg:inline"> owned</span>
      </div>
      <div>
        <b className="font-semibold">{stats.numberOfPreviouslyOwned}</b> prev
        <span className="md:hidden lg:inline">iously</span> owned
        <span className="md:hidden lg:inline"> games</span>
      </div>
      <div>
        <b className="font-semibold">{stats.yetToBePlayed}</b>{" "}
        <span className="hidden md:inline lg:hidden">unplayed</span>
        <span className="md:hidden lg:inline">games yet to be played</span>
      </div>
      <div>
        <b className="font-semibold">{stats.top100Games}</b>{" "}
        <span className="md:hidden lg:inline">games from the </span> top 100
      </div>
      <div>
        <b className="font-semibold">{stats.averageRating.toFixed(1)}</b> average rating
      </div>
    </>
  );
};
