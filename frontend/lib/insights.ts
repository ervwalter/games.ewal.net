import dayjs from "dayjs";
import { orderBy, toPairs } from "lodash-es";
import { getPlays } from "./games-data";
import { Play } from "./games-interfaces";

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

class PlayerData {
  player: string;
  plays = 0;
  scoredPlays = 0;
  wins = 0;
  winChanceAccumulator = 0;
  expectedWinChanceWins = 0;
  expectedWinChanceAttempts = 0;
  games: Record<string, boolean> = {};

  constructor(player: string) {
    this.player = player;
  }
}

export interface PlayerStats {
  playerName: string;
  plays: number;
  scoredPlays: number;
  uniqueGames: number;
  wins: number;
  losses: number;
  winPercentage: number;
  expectedWinPercentage: number;
}

export async function getInsights() {
  const plays = await getPlays();

  const locationsMap: Record<string, number> = {};
  const daysOfTheWeekMap: Record<number, number> = {};
  const playerCountsMap: Record<number, number> = {};
  const durationBucketCountsMap: Record<number, number> = {};

  const players: Record<string, PlayerData> = {};
  const me = new PlayerData("Erv");
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
      let containsErv = false;
      for (const player of play.players) {
        const playerName = player.name;
        if (playerName === me.player) {
          containsErv = true;
        }
        if (playerName === "Anonymous player") {
          continue;
        }
        const playerData = getPlayerData(players, playerName);

        playerData.games[play.gameId] = true;
        playerData.plays += play.numPlays;
        if (!play.excludeFromStats) {
          playerData.scoredPlays += play.numPlays;
          if (player.win) {
            playerData.wins += play.numPlays;
          }

          // track expected win rate
          const competitorCount = effectiveCompetitorsCount(play);
          playerData.expectedWinChanceWins += play.numPlays;
          playerData.expectedWinChanceAttempts += competitorCount * play.numPlays;
          playerData.winChanceAccumulator += (1 / competitorCount) * play.numPlays;
        }
      }
      if (!containsErv) {
        // logged play doesn't include me for some reason, at least record basic information for myself anyway
        me.plays += play.numPlays;
        me.games[play.gameId] = true;
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
      // const expectedWinPercentage = player.expectedWinChanceWins / player.expectedWinChanceAttempts;
      const expectedWinPercentage = player.winChanceAccumulator / scoredPlays;
      const stats: PlayerStats = {
        playerName,
        plays,
        scoredPlays,
        uniqueGames,
        wins,
        losses,
        winPercentage,
        expectedWinPercentage,
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

function getPlayerData(players: Record<string, PlayerData>, playerName: string) {
  let playerStats = players[playerName];
  if (!playerStats) {
    playerStats = new PlayerData(playerName);
    players[playerName] = playerStats;
  }
  return playerStats;
}

const teamRegex = /^Team:\ (.+)$/i;

function effectiveCompetitorsCount(play: Play) {
  // first check if it is probably cooperative
  const winners = play.players.filter((p) => p.win).length;
  const probablyCooperative = winners === 0 || winners === play.players.length; // if everyone won or everyone lost it was probably cooperative
  // if this is a cooperative game, the number of the competitors is 2 (the players + the game)
  if (probablyCooperative || play.cooperativeGame) {
    return 2;
  }

  // now check if it is a teams game
  let isProbablyTeams = true; // start with the assumption of teams
  const teams: Record<string, true> = {};
  for (const player of play.players) {
    if (!player.color) {
      isProbablyTeams = false;
      break;
    }
    const match = player.color.match(teamRegex);
    if (!match) {
      isProbablyTeams = false;
      break;
    }
    teams[match[1]] = true;
  }

  if (isProbablyTeams) {
    // return the number of teams
    return Object.keys(teams).length;
  } else {
    // return the number of players
    return play.players.length;
  }
}
