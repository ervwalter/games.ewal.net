/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { SkeletonImage, SkeletonWrapper } from "./skeleton";
import { Thumbnail, ThumbnailLink } from "./thumbnail";

interface ThumbnailListProps {
  thumbnails: Thumbnail[];
  singleRow: boolean;
}

export const ThumbnailList = ({ thumbnails, singleRow }: ThumbnailListProps) => {
  return (
    <div className={clsx("hidden flex-row flex-wrap md:flex", { "max-h-[114px] overflow-hidden": singleRow })}>
      {thumbnails.map((thumbnail) => (
        <ThumbnailLink thumbnail={thumbnail} className="m-[2px]" size="h-[110px] w-auto" key={thumbnail.gameId} />
      ))}
    </div>
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
