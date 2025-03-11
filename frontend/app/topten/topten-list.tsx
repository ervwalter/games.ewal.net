import PlayCount from "components/play-count";
import { Rating } from "components/rating";
import { ThumbnailLink } from "components/thumbnail";
import { TopTenItem } from "lib/games-interfaces";

export function TopTenList({ topten }: { topten: TopTenItem[] }) {
  return (
    <div className="flex flex-col divide-y border-gray-200  ">
      {topten.map((game) => (
        <div className="flex flex-col items-start gap-6 py-4 first:pt-0 md:flex-row" key={game.gameId}>
          <div className="hidden w-10 flex-none text-2xl md:block">
            #<span className="font-semibold">{game.rank}</span>
          </div>

          <div className="hidden w-[130px] flex-none md:block">
            <ThumbnailLink
              thumbnail={game}
              className="block w-fit bg-transparent md:mx-auto"
              size="max-h-[126px] max-w-full "
            />
          </div>
          <div>
            <div className="flex flex-row gap-4">
              <div className="flex-none text-2xl md:hidden">
                #<span className="font-semibold">{game.rank}</span>
              </div>
              <div className="flex-1">
                <div>
                  <a
                    href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-focus hover:underline font-semibold">
                    {game.name}
                  </a>
                  <span className="hidden md:inline"> ({game.yearPublished})</span>
                </div>
                <div className="text-[0.8em]">
                  <span className="md:hidden">Played </span>
                  <PlayCount plays={game.numPlays} /> • Rating: <Rating rating={game.rating} />
                  <span className="hidden lg:inline">
                    {" "}
                    • Designed By: <b className="font-semibold">{game.designers.join(",")}</b>
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-[0.8em] md:mt-0 lg:hidden">
              Designed By: <b className="font-semibold">{game.designers.join(",")}</b>
            </div>{" "}
            <div className="pb-4 text-[0.8em] italic">{game.mechanics.join(" • ")}</div>
            <div className="text-[0.8em]">{game.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
