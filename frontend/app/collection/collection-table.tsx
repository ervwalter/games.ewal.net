"use client";

import { Game } from "lib/models";
import { orderBy } from "lodash";
import React, { useCallback, useMemo, useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

export default function CollectionTable({ collection }: { collection: Game[] }) {
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const games = useMemo(
    () => orderBy(collection, [sortColumn, "name"], [sortDirection, "asc"]),
    [sortColumn, sortDirection]
  );

  const handleSortByName = useCallback(
    (column: string) => {
      if (sortColumn != column) {
        setSortColumn(column);
        setSortDirection(column === "name" ? "asc" : "desc");
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
              className="cursor-pointer py-2 pr-2 pl-4 text-left font-semibold text-gray-900 hover:underline md:pl-2"
              onClick={() => handleSortByName("name")}>
              Name
            </th>
            <th
              className="cursor-pointer py-2 px-2 text-left font-semibold text-gray-900 hover:underline"
              onClick={() => handleSortByName("numPlays")}>
              <span className="hidden md:inline">Times </span>Played
            </th>
            <th
              className="w-0 cursor-pointer py-2 pl-2 pr-4 text-left font-semibold text-gray-900 hover:underline md:pr-2"
              onClick={() => handleSortByName("rating")}>
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
    <tr className="even:bg-gray-50">
      <td className="py-2 pl-4 pr-2 md:pl-2">
        <a
          href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="link-hover link-primary link ">
          {game.name}
        </a>
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

const PlayCount = React.memo(function PlayCount({ plays }: { plays?: number }) {
  if (plays && plays > 0) {
    return (
      <span className="whitespace-nowrap">
        <span className="hidden lg:inline">Played </span>
        <b className="font-semibold">{plays}</b> time{plays > 1 ? "s" : ""}
      </span>
    );
  } else {
    return <span>—</span>;
  }
});

const Rating = React.memo(function Rating({ rating }: { rating?: number }) {
  if (rating && rating > 0) {
    return (
      <>
        <span className="md:hidden">{rating}</span>
        <span className="relative hidden md:block" title={`Rating: ${rating}`}>
          <span className="flex flex-row text-gray-300">
            <FaRegStar className="h-4 w-4 flex-none" />
            <FaRegStar className="h-4 w-4 flex-none" />
            <FaRegStar className="h-4 w-4 flex-none" />
            <FaRegStar className="h-4 w-4 flex-none" />
            <FaRegStar className="h-4 w-4 flex-none" />
            <FaRegStar className="h-4 w-4 flex-none" />
            <FaRegStar className="h-4 w-4 flex-none" />
            <FaRegStar className="h-4 w-4 flex-none" />
            <FaRegStar className="h-4 w-4 flex-none" />
            <FaRegStar className="h-4 w-4 flex-none" />
          </span>
          <span
            className="absolute top-0 left-0 z-10 flex h-full w-full flex-row overflow-hidden text-yellow-500 opacity-70"
            style={{ width: `${rating * 10}%` }}>
            <FaStar className="h-4 w-4 flex-none" />
            <FaStar className="h-4 w-4 flex-none" />
            <FaStar className="h-4 w-4 flex-none" />
            <FaStar className="h-4 w-4 flex-none" />
            <FaStar className="h-4 w-4 flex-none" />
            <FaStar className="h-4 w-4 flex-none" />
            <FaStar className="h-4 w-4 flex-none" />
            <FaStar className="h-4 w-4 flex-none" />
            <FaStar className="h-4 w-4 flex-none" />
            <FaStar className="h-4 w-4 flex-none" />
          </span>
        </span>
      </>
    );
  } else {
    return <span>—</span>;
  }
});
