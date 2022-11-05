import dayjs from "dayjs";
import { groupBy } from "lodash";
import { getCollection, getPlays } from "./games-data";
import { CollectionStats, Game, Play, PlayedGame, PlayStats } from "./models";
import { duration, groupPlays } from "./plays-stats";

export async function getOverviewStats() {
  const _plays = getPlays();
  const _collection = getCollection();
  const [plays, collection] = await Promise.all([_plays, _collection]);

  const thisYear = dayjs().year().toString();

  const collectionStats = calculateCollectionStats(collection);
  const allTimeStats = calculatePlayStats(plays, groupPlays(plays));
  const thisYearStats = calculatePlayStats(plays.filter((p) => p.playDate.startsWith(thisYear)));

  return {
    collectionStats,
    allTimeStats,
    thisYearStats,
  };
}

function calculateCollectionStats(games: Game[]) {
  const stats: CollectionStats = {
    averageRating: 0,
    numberOfExpansions: 0,
    numberOfGames: 0,
    numberOfPreviouslyOwned: 0,
    preordered: 0,
    top100Games: 0,
    wantToBuy: 0,
    yetToBePlayed: 0,
  };

  let ratingNumerator = 0;
  let ratingDenominator = 0;

  // process each owned game
  for (const game of games) {
    if (game.owned) {
      stats.numberOfGames++;

      // count expansions only if they are listed as 'owned'
      if (game.ownedExpansionCount) {
        stats.numberOfExpansions += game.ownedExpansionCount;
      }

      // how many games have never been played
      if (game.numPlays === 0 && !game.forTrade && !game.collectingOnly) {
        stats.yetToBePlayed++;
      }

      // include in average rating
      if (game.rating && game.rating > 0) {
        ratingNumerator += game.rating;
        ratingDenominator++;
      }

      if (game.rank && game.rank <= 100) {
        stats.top100Games++;
      }
    } else if (game.previousOwned) {
      stats.numberOfPreviouslyOwned++;
    } else if (game.preOrdered) {
      stats.preordered++;
    } else if (game.wantToBuy) {
      stats.wantToBuy++;
    }
  }
  if (ratingDenominator > 0) {
    stats.averageRating = ratingNumerator / ratingDenominator;
  }

  return stats;
}

function calculatePlayStats(plays: Play[], games?: PlayedGame[]) {
  const stats: PlayStats = {
    dimes: 0,
    hIndex: 0,
    hoursPlayed: 0,
    locations: 0,
    namedPlayers: 0,
    newGames: 0,
    nickles: 0,
    numberOfPlays: 0,
    quarters: 0,
    uniqueGames: 0,
  };

  stats.numberOfPlays = plays.length;
  stats.uniqueGames = Object.keys(groupBy(plays, (p) => p.gameId)).length;
  const players = new Set<string>();
  const locations = new Set<string>();
  let newGames = 0;
  let totalDuration = 0;

  for (const play of plays) {
    if (play.players) {
      for (const player of play.players) {
        // count how many games are marked as new to me
        if (player.name.toLowerCase() === "erv") {
          if (player.new) {
            newGames++;
          }
        }

        // exclude anonymous players from the player count
        if (player.name.toLowerCase() !== "anonymous player") {
          players.add(player.name.toLowerCase());
        }
      }
    }

    // calculate the total duration
    totalDuration += duration(play);

    // find all the unique locations
    locations.add(play.location.toLowerCase());
  }

  stats.namedPlayers = players.size;
  stats.locations = locations.size;
  stats.newGames = newGames;
  stats.hoursPlayed = Math.round(totalDuration / 60);

  if (games) {
    stats.hIndex = 0;
    stats.quarters = 0;
    stats.dimes = 0;
    stats.nickles = 0;
    let index = 0;

    for (const game of games) {
      if (game.numPlays) {
        // calculate h-index
        if (++index <= game.numPlays) {
          stats.hIndex++;
        }

        if (game.numPlays >= 25) {
          stats.quarters++;
        } else if (game.numPlays >= 10) {
          stats.dimes++;
        } else if (game.numPlays >= 5) {
          stats.nickles++;
        }
      }
    }
  }

  return stats;
}
