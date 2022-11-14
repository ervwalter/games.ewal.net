import dayjs from "dayjs";
import { orderBy, toPairs } from "lodash-es";
import { getPlays } from "./games-data";

const dayNames: Record<string, string> = {
  "0": "Sun",
  "1": "Mon",
  "2": "Tue",
  "3": "Wed",
  "4": "Thu",
  "5": "Fri",
  "6": "Sat",
};

const durationBuckets = [
  {
    cutoff: 180,
    name: "3+ hrs",
  },
  {
    cutoff: 120,
    name: "2-3 hrs",
  },
  {
    cutoff: 61,
    name: "1-2 hrs",
  },
  {
    cutoff: 30,
    name: "30-60 min",
  },
  {
    cutoff: 0,
    name: "under 30 min",
  },
];

class PlayerDetails {
  player: string;
  plays = 0;
  scoredPlays = 0;
  wins = 0;
  games: Record<string, boolean> = {};

  constructor(player: string) {
    this.player = player;
  }
}

interface PlayerStats {
  playerName: string;
  plays: number;
  scoredPlays: number;
  uniqueGames: number;
  wins: number;
  losses: number;
  winPercentage: number;
}

export async function getInsights() {
  const plays = await getPlays();

  const locationsMap: Record<string, number> = {};
  const daysOfTheWeekMap: Record<number, number> = {};
  const playerCountsMap: Record<number, number> = {};
  const durationBucketCountsMap: Record<number, number> = {};

  const players: Record<string, PlayerDetails> = {};
  const me = new PlayerDetails("Erv");
  players["Erv"] = me;

  for (const play of plays) {
    const dow = dayjs(play.playDate).day();
    daysOfTheWeekMap[dow] = (daysOfTheWeekMap[dow] ?? 0) + play.numPlays;
    if (play.location) {
      locationsMap[play.location] = (locationsMap[play.location] ?? 0) + play.numPlays;
    }
    const perPlayDuration =
      play.duration && play.duration > 0 ? play.duration / play.numPlays : play.estimatedDuration ?? 0;
    if (perPlayDuration > 0) {
      for (let bucket = 0; bucket < durationBuckets.length; bucket++) {
        if (perPlayDuration >= durationBuckets[bucket].cutoff) {
          durationBucketCountsMap[bucket] = (durationBucketCountsMap[bucket] ?? 0) + play.numPlays;
          break;
        }
      }
    }
    if (play.players && play.players.length > 0) {
      playerCountsMap[play.players.length] = (playerCountsMap[play.players.length] ?? 0) + play.numPlays;
      for (const player of play.players) {
        const playerName = player.name;
        if (playerName === "Anonymous player") {
          continue;
        }
        const playerDetails = getPlayerDetails(players, playerName);

        playerDetails.games[play.gameId] = true;
        playerDetails.plays += play.numPlays;
        if (!play.excludeFromStats) {
          playerDetails.scoredPlays += play.numPlays;
          if (player.win) {
            playerDetails.wins += play.numPlays;
          }
        }
      }
    } else {
      // at least record basic information for myself if there were no recorded players
      me.plays += play.numPlays;
      me.games[play.gameId] = true;
    }
  }

  const statsPerPlayer: PlayerStats[] = orderBy(
    Object.keys(players).map((playerName) => {
      const player = players[playerName];
      const uniqueGames = Object.keys(player.games).length;
      const plays = player.plays;
      const scoredPlays = player.scoredPlays;
      const wins = player.wins;
      const losses = scoredPlays - wins;
      const winPercentage = wins / scoredPlays;
      const stats: PlayerStats = {
        playerName,
        plays,
        scoredPlays,
        uniqueGames,
        wins,
        losses,
        winPercentage,
      };
      return stats;
    }),
    ["plays", "playerName"],
    ["desc", "asc"]
  );

  const locations = orderBy(
    toPairs(locationsMap).map(([location, plays]) => ({ location, plays })),
    ["plays", "location"],
    ["desc", "asc"]
  );

  const daysOfTheWeek = orderBy(
    toPairs(daysOfTheWeekMap).map(([day, plays]) => ({ day, plays })),
    ["day"],
    ["asc"]
  ).map((d) => ({ day: dayNames[d.day], plays: d.plays }));

  const playerCounts = orderBy(
    toPairs(playerCountsMap).map(([playerCount, plays]) => ({
      playerCount: parseInt(playerCount),
      plays,
    })),
    ["playerCount"],
    ["asc"]
  ).map((d) => ({ players: `${d.playerCount} player${d.playerCount > 1 ? "s" : ""}`, plays: d.plays }));

  const durations = orderBy(
    toPairs(durationBucketCountsMap).map(([bucket, plays]) => ({ bucket, plays })),
    ["bucket"],
    ["desc"]
  ).map((d) => ({ bucket: durationBuckets[parseInt(d.bucket)].name, plays: d.plays }));

  return {
    locations,
    daysOfTheWeek,
    playerCounts,
    durations,
    statsPerPlayer,
  };
}

export type Insights = Awaited<ReturnType<typeof getInsights>>;

function getPlayerDetails(players: Record<string, PlayerDetails>, playerName: string) {
  let playerStats = players[playerName];
  if (!playerStats) {
    playerStats = new PlayerDetails(playerName);
    players[playerName] = playerStats;
  }
  return playerStats;
}
