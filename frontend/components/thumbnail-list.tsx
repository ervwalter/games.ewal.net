/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { SkeletonImage, SkeletonWrapper } from "./skeleton";

interface Thumbnail {
  gameId: string;
  name: string;
  thumbnail: string;
}

interface ThumbnailListProps {
  thumbnails: Thumbnail[];
  singleRow: boolean;
}

export const ThumbnailList = ({ thumbnails, singleRow }: ThumbnailListProps) => {
  return (
    <div className={clsx("hidden flex-row flex-wrap md:flex", { "max-h-[114px] overflow-hidden": singleRow })}>
      {thumbnails.map((thumbnail) => (
        <Thumbnail thumbnail={thumbnail} className="m-[2px]" key={thumbnail.gameId} />
      ))}
    </div>
  );
};

interface ThumbnailProps {
  thumbnail: Thumbnail;
  className?: string;
}

const Thumbnail = ({ thumbnail, className }: ThumbnailProps) => {
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
        className="inline-block h-[110px] w-auto hover:opacity-95"
      />
    </a>
  );
};

export function ThumbnailListSkeleton({ singleRow }: { singleRow: boolean }) {
  return (
    <SkeletonWrapper
      className={clsx("hidden flex-row flex-wrap md:flex", { "max-h-[114px] overflow-hidden": singleRow })}>
      {[...Array(25)].map((_, index) => (
        <SkeletonImage className="m-[2px] h-[110px] w-[90px]" key={index} />
      ))}
    </SkeletonWrapper>
  );
}
