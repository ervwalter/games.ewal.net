"use client";

import { Insights } from "lib/insights";
import { orderBy } from "lodash-es";
import { useCallback, useMemo, useState } from "react";

export default function PlayersTable({ insights }: { insights: Insights }) {
  const [sortColumn, setSortColumn] = useState("plays");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const players = useMemo(
    () => orderBy(insights.statsPerPlayer, [sortColumn, "playerName"], [sortDirection, "asc"]),
    [insights.statsPerPlayer, sortColumn, sortDirection]
  );

  const handleSortByName = useCallback(
    (column: string) => {
      if (sortColumn != column) {
        setSortColumn(column);
        setSortDirection(column === "playerName" ? "asc" : "desc");
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
              className="cursor-pointer py-2 pr-4 pl-4 text-left font-semibold text-gray-900 hover:underline md:pl-0"
              onClick={() => handleSortByName("playerName")}>
              Name
            </th>
            <th
              className="cursor-pointer py-2 px-2 text-right font-semibold text-gray-900 hover:underline"
              onClick={() => handleSortByName("plays")}>
              Plays
            </th>
            <th
              className="cursor-pointer py-2 px-2 text-right font-semibold text-gray-900 hover:underline"
              onClick={() => handleSortByName("uniqueGames")}>
              <span className="hidden md:inline">Unique </span>Games
            </th>
            <th
              className="cursor-pointer py-2 px-2 text-right font-semibold text-gray-900 hover:underline"
              onClick={() => handleSortByName("wins")}>
              Wins
            </th>
            <th
              className="hidden cursor-pointer py-2 px-2 text-right font-semibold text-gray-900 hover:underline md:table-cell"
              onClick={() => handleSortByName("losses")}>
              Losses
            </th>
            <th
              className="cursor-pointer py-2 pl-2 pr-4 text-right font-semibold text-gray-900 hover:underline md:pr-2"
              onClick={() => handleSortByName("winPercentage")}>
              W<span className="hidden md:inline">in </span>%
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {players.map((player) => (
            <tr className="even:bg-gray-100 even:bg-opacity-50" key={player.playerName}>
              <td className="py-2 pl-4 pr-2 md:pl-0">{player.playerName}</td>
              <td className="py-2 px-2 text-right">{player.plays.toLocaleString()}</td>
              <td className="py-2 px-2 text-right">{player.uniqueGames.toLocaleString()}</td>
              <td className="py-2 px-2 text-right">{player.wins.toLocaleString()}</td>
              <td className="hidden py-2 px-2 text-right md:table-cell">{player.losses.toLocaleString()}</td>
              <td className="py-2 pl-2 pr-4 text-right md:pr-2 ">{Math.round(player.winPercentage * 100)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
