import dayjs from "dayjs";
import { orderBy, sumBy, toPairs } from "lodash";
import { duration, getPlays } from "./games-data";

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
    cutoff: 90,
    name: "90-120 min",
  },
  {
    cutoff: 60,
    name: "60-90 min",
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

class GameDetails {
  gameId: string;
  gameName: string;
  thumbnail: string;
  playerName: string;
  plays = 0;
  scoredPlays = 0;
  wins = 0;
  minutes = 0;
  players: Record<string, boolean> = {};

  constructor(id: string, gameName: string, thumbnail: string, playerName: string) {
    this.gameId = id;
    this.gameName = gameName;
    this.thumbnail = thumbnail;
    this.playerName = playerName;
  }
}

class PlayerDetails {
  player: string;
  games: Record<string, GameDetails> = {};

  constructor(player: string) {
    this.player = player;
  }
}

interface PlayerStats {
  playerName: string;
  plays: number;
  uniqueGames: number;
  wins: number;
  losses: number;
  winPercentage: number;
}

export async function getInsights() {
  const plays = (await getPlays()).filter((p) => !p.excludeFromStats);

  const locationsMap: Record<string, number> = {};
  const daysOfTheWeekMap: Record<number, number> = {};
  const playerCountsMap: Record<number, number> = {};
  const durationBucketCountsMap: Record<number, number> = {};

  const players: Record<string, PlayerDetails> = {};
  const me = new PlayerDetails("Erv");
  players["Erv"] = me;

  for (const play of plays) {
    const dow = dayjs(play.playDate).day();
    daysOfTheWeekMap[dow] = (daysOfTheWeekMap[dow] ?? 0) + 1;
    if (play.location) {
      locationsMap[play.location] = (locationsMap[play.location] ?? 0) + 1;
    }
    const perPlayDuration =
      play.duration && play.duration > 0 ? play.duration / (play.numPlays || 1) : play.estimatedDuration ?? 0;
    if (perPlayDuration > 0) {
      for (let bucket = 0; bucket < durationBuckets.length; bucket++) {
        if (perPlayDuration >= durationBuckets[bucket].cutoff) {
          durationBucketCountsMap[bucket] = (durationBucketCountsMap[bucket] ?? 0) + (play.numPlays || 1);
          break;
        }
      }
    }
    if (play.players && play.players.length > 0) {
      playerCountsMap[play.players.length] = (playerCountsMap[play.players.length] ?? 0) + 1;
      for (const player of play.players) {
        const playerName = player.name;
        if (playerName === "Anonymous player") {
          continue;
        }
        const playerDetails = getPlayerDetails(players, playerName);
        const gameDetails = getGameDetails(playerDetails, play.gameId, play.thumbnail, play.name);

        gameDetails.plays++;
        gameDetails.scoredPlays++;
        if (player.win) {
          gameDetails.wins++;
        }
        gameDetails.minutes += duration(play);

        if (playerName === "Erv") {
          // just for me, accumulate who else I have played this game with
          for (const otherPlayer of play.players) {
            if (otherPlayer.name === playerName) {
              continue;
            }
            gameDetails.players[otherPlayer.name] = true;
          }
        }
      }
    } else {
      // at least record basic information for myself if there were no recorded players
      const gameDetails = getGameDetails(me, play.gameId, play.thumbnail, play.name);
      gameDetails.plays++;
      gameDetails.minutes += duration(play);
    }
  }

  const statsPerPlayer: PlayerStats[] = orderBy(
    Object.keys(players).map((playerName) => {
      const games = players[playerName].games;
      const uniqueGames = Object.values(games).filter((g) => g.scoredPlays > 0).length;
      const plays = sumBy(Object.values(games), "scoredPlays");
      const wins = sumBy(Object.values(games), "wins");
      const losses = plays - wins;
      const winPercentage = wins / plays;
      return {
        playerName,
        plays,
        uniqueGames,
        wins,
        losses,
        winPercentage,
      };
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

function getGameDetails(playerStats: PlayerDetails, gameId: string, gameName: string, thumbnail: string) {
  let gameStats = playerStats.games[gameId];
  if (!gameStats) {
    gameStats = new GameDetails(gameId, gameName, thumbnail, playerStats.player);
    playerStats.games[gameId] = gameStats;
  }
  return gameStats;
}
