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
  winPercentage: number;
}

interface GameRecord {
  gameId: string;
  name: string;
  thumbnail: string;
  value: number;
}

interface GameRecords {
  mostWins: GameRecord;
  mostLosses: GameRecord;
  highestWinPercentage: GameRecord;
  lowestWinPercentage: GameRecord;
  mostOtherPlayers: GameRecord;
}

export async function getInsights() {
  const plays = (await getPlays()).filter((p) => !p.excludeFromStats);

  const locationsMap: Record<string, number> = {};
  const daysOfTheWeekMap: Record<number, number> = {};
  const playerCountsMap: Record<number, number> = {};

  const players: Record<string, PlayerDetails> = {};
  const me = new PlayerDetails("Erv");
  players["Erv"] = me;

  for (const play of plays) {
    const dow = dayjs(play.playDate).day();
    daysOfTheWeekMap[dow] = (daysOfTheWeekMap[dow] ?? 0) + 1;
    if (play.location) {
      locationsMap[play.location] = (locationsMap[play.location] ?? 0) + 1;
    }
    if (play.players && play.players.length > 0) {
      playerCountsMap[play.players.length] = (playerCountsMap[play.players.length] ?? 0) + 1;
      for (const player of play.players) {
        const playerName = player.name;
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
      const winPercentage = wins / plays;
      return {
        playerName,
        plays,
        uniqueGames,
        wins,
        winPercentage,
      };
    }),
    ["plays", "playerName"],
    ["desc", "asc"]
  );

  // const myGames = Object.values(me.games).filter((g) => g.scoredPlays > 1);
  // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // const mostWinsGame = maxBy(myGames, (g) => g.wins)!;
  // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // const mostLossesGame = maxBy(myGames, (g) => g.scoredPlays - g.wins)!;
  // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // const highestWinPercentageGame = maxBy(myGames, (g) => g.wins / g.scoredPlays)!;
  // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // const lowestWinPercentageGame = maxBy(myGames, (g) => 1 - g.wins / g.scoredPlays)!;
  // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // const mostOtherPlayersGame = maxBy(myGames, (g) => Object.keys(g.players).length)!;

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
    ["plays", "playerCount"],
    ["desc", "asc"]
  ).map((d) => ({ players: `${d.playerCount} player${d.playerCount > 1 ? "s" : ""}`, plays: d.plays }));

  return {
    locations,
    daysOfTheWeek,
    playerCounts,
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
