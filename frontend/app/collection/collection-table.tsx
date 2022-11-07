"use client";

import { Game } from "lib/models";
import { orderBy } from "lodash";
import { useCallback, useMemo, useState } from "react";

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
              className="cursor-pointer py-2 pl-2 pr-4 text-left font-semibold text-gray-900 hover:underline md:pr-2"
              onClick={() => handleSortByName("rating")}>
              <span className="hidden md:inline">My </span>Rating
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {games.map((game) => (
            <tr className="even:bg-gray-50" key={game.gameId}>
              <td className="py-2 pl-4 pr-2 md:pl-2">
                <a
                  href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-hover link-primary link ">
                  {game.name}
                </a>
              </td>
              <td className="py-2 px-2 text-center md:text-left">{game.numPlays}</td>
              <td className="py-2 pl-2 pr-4 text-center md:pr-2 md:text-left">{game.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
