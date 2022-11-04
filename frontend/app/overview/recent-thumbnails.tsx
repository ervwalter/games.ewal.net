/* eslint-disable @next/next/no-img-element */
import { Play } from "lib/models";

interface RecentThumbnailsProps {
  plays: Play[];
}

export const RecentThumbnails = ({ plays }: RecentThumbnailsProps) => {
  return (
    <div className="hidden max-h-[110px] flex-row flex-wrap space-x-1 overflow-hidden md:flex">
      {plays.map((play) => (
        <PlayThumbnail play={play} key={play.playId} />
      ))}
    </div>
  );
};

interface PlayThumbnailProps {
  play: Play;
}

const PlayThumbnail = ({ play }: PlayThumbnailProps) => {
  return (
    <a
      href={`https://boardgamegeek.com/boardgame/${play.gameId}/`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-black"
    >
      <img
        src={play.thumbnail}
        alt={play.name}
        title={play.name}
        className="inline-block h-[110px] w-auto hover:opacity-95"
      />
    </a>
  );
};
