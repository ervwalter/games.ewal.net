/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";

export interface Thumbnail {
  gameId: string;
  name: string;
  thumbnail: string;
}

interface ThumbnailProps {
  thumbnail: Thumbnail;
  className?: string;
  size?: string;
}

export const ThumbnailLink = ({ thumbnail, className, size }: ThumbnailProps) => {
  return (
    <a
      href={`https://boardgamegeek.com/boardgame/${thumbnail.gameId}/`}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx("bg-black", className)}>
      <img
        src={thumbnail.thumbnail}
        alt={thumbnail.name}
        title={thumbnail.name}
        className={clsx(size, "inline-block hover:opacity-95")}
      />
    </a>
  );
};
