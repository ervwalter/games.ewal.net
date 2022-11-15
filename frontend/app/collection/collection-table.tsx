"use client";

import PlayCount from "components/play-count";
import { Rating } from "components/rating";
import { Game } from "lib/games-interfaces";
import { orderBy } from "lodash-es";
import React, { useCallback, useMemo, useState } from "react";

export default function CollectionTable({ collection }: { collection: Game[] }) {
  const [sortColumn, setSortColumn] = useState("sortableName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const games = useMemo(
    () => orderBy(collection, [sortColumn, "sortableName"], [sortDirection, "asc"]),
    [collection, sortColumn, sortDirection]
  );

  const handleSort = useCallback(
    (column: string) => {
      if (sortColumn != column) {
        setSortColumn(column);
        setSortDirection(column === "sortableName" ? "asc" : "desc");
      } else {
        setSortDirection((dir) => (dir === "asc" ? "desc" : "asc"));
      }
    },
    [sortColumn]
  );

  return (
    <div className="-mx-4 md:mx-0">
      <table className="min-w-full divide-y divide-gray-300 md:min-w-fit">
        <thead>
          <tr>
            <th
              className="cursor-pointer py-2 pr-2 pl-4 text-left font-semibold text-gray-900 hover:underline md:pl-0"
              onClick={() => handleSort("sortableName")}>
              Name
            </th>
            <th
              className="cursor-pointer py-2 px-2 text-left font-semibold text-gray-900 hover:underline"
              onClick={() => handleSort("numPlays")}>
              <span className="hidden md:inline">Times </span>Played
            </th>
            <th
              className="cursor-pointer py-2 pl-2 pr-4 text-center font-semibold text-gray-900 hover:underline md:pr-2 md:text-left"
              onClick={() => handleSort("rating")}>
              <span className="hidden md:inline">My </span>Rating
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {games.map((game) => (
            <CollectionRow game={game} key={game.gameId} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

const CollectionRow = React.memo(function CollectionRow({ game }: { game: Game }) {
  return (
    <tr className="even:bg-gray-100 even:bg-opacity-50">
      <td className="py-2 pl-4 pr-2 md:pl-0">
        <a
          href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="link-hover link-primary link ">
          {game.name}
        </a>
        <Expansions game={game} />
      </td>
      <td className="py-2 px-2 text-left">
        <PlayCount plays={game.numPlays} />
      </td>
      <td className="py-2 pl-2 pr-4 text-center md:pr-2 md:text-left">
        <Rating rating={game.rating} />
      </td>
    </tr>
  );
});

const Expansions = React.memo(function Expansions({ game }: { game: Game }) {
  if (!game.ownedExpansions || game.ownedExpansions.length == 0) {
    return null;
  } else {
    const maxIndex = game.ownedExpansions.length - 1;
    return (
      <div className="group relative hidden pl-2 lg:inline-block">
        <span className="cursor-default border-b border-dotted border-gray-400 text-sm text-gray-400">
          {game.ownedExpansions.length} expansions
        </span>
        <div className="invisible absolute bottom-0 left-full z-20 ml-2 whitespace-nowrap rounded-md border border-gray-200 bg-white p-4 text-gray-600 opacity-0 shadow-md transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
          {orderBy(game.ownedExpansions, "sortableShortName").map((expansion, index) => (
            <div className="" key={expansion.gameId}>
              {expansion.shortName}
              {index < maxIndex ? "," : ""}
            </div>
          ))}
        </div>
      </div>
    );
  }
});
