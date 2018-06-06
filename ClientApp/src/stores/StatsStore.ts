import _ from "lodash";
import { computed } from "mobx";
import moment from "moment";
import { CollectionStore, Game } from "~/stores/CollectionStore";
import { Play, PlayStore, PlayedGame } from "~/stores/PlayStore";

type tbd = number | "...";

class PlayStats {
  readonly numberOfPlays: tbd = "...";
  readonly uniqueGames: tbd = "...";
  readonly namedPlayers: tbd = "...";
  readonly locations: tbd = "...";
  readonly newGames: tbd = "...";
  readonly hoursPlayed: string = "...";
  readonly quarters: tbd = "...";
  readonly dimes: tbd = "...";
  readonly nickles: tbd = "...";
  readonly hIndex: tbd = "...";

  public constructor(plays?: Play[], games?: PlayedGame[]) {
    if (plays) {
      this.numberOfPlays = plays.length;
      this.uniqueGames = Object.keys(
        _.groupBy(plays, play => play.gameId)
      ).length;
      const players = new Set<string>();
      const locations = new Set<string>();
      let newGames = 0;
      let duration = 0;

      // process each play
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
        if (play.duration && play.duration > 0) {
          duration += play.duration;
        } else if (play.estimatedDuration && play.estimatedDuration > 0) {
          // use the estimated duration of an explicit one was not specified
          duration += play.estimatedDuration;
        }

        // find all the unique locations
        locations.add(play.location.toLowerCase());
      }

      this.namedPlayers = players.size;
      this.locations = locations.size;
      this.newGames = newGames;

      // convert to hours
      duration = Math.round(duration / 60);

      // toLocaleString adds comma separators
      this.hoursPlayed = "≈" + duration.toLocaleString();
    }

    if (games) {
      this.hIndex = 0;
      this.quarters = 0;
      this.dimes = 0;
      this.nickles = 0;
      let index = 0;
      for (const game of games) {
        // calculate h-index
        if (++index <= game.numPlays!) {
          this.hIndex++;
        }

        if (game.numPlays! >= 25) {
          this.quarters++;
        } else if (game.numPlays! >= 10) {
          this.dimes++;
        } else if (game.numPlays! >= 5) {
          this.nickles++;
        }
      }
    }
  }
}

class CollectionStats {
  readonly numberOfGames: tbd = "...";
  readonly numberOfExpansions: tbd = "...";
  readonly numberOfPreviouslyOwned: tbd = "...";
  readonly yetToBePlayed: tbd = "...";
  readonly preordered: tbd = "...";
  readonly averageRating: tbd = "...";
  readonly top100Games: tbd = "...";

  public constructor(games?: Game[]) {
    if (games) {
      this.numberOfGames = 0;
      this.numberOfExpansions = 0;
      this.numberOfPreviouslyOwned = 0;
      this.yetToBePlayed = 0;
      this.preordered = 0;
      this.top100Games = 0;

      let ratingNumerator = 0;
      let ratingDenominator = 0;

      // process each owned game
      for (const game of games) {
        if (game.owned) {
          this.numberOfGames++;

          // count expansions only if they are listed as 'owned'
          if (game.ownedExpansionCount) {
            this.numberOfExpansions += game.ownedExpansionCount;
          }

          // how many games have never been played
          if (game.numPlays === 0) {
            this.yetToBePlayed++;
          }

          // include in average rating
          if (game.rating && game.rating > 0) {
            ratingNumerator += game.rating;
            ratingDenominator++;
          }

          if (game.rank && game.rank <= 100) {
            this.top100Games++;
          }
        } else if (game.previousOwned) {
          this.numberOfPreviouslyOwned++;
        } else if (game.preOrdered) {
          this.preordered++;
        }
      }
      if (ratingDenominator > 0) {
        this.averageRating = ratingNumerator / ratingDenominator;
      }
    }
  }
}

export class StatsStore {
  public constructor(
    private playStore: PlayStore,
    private collectionStore: CollectionStore
  ) {}

  @computed
  public get thirtyDaysStats() {
    if (!this.playStore.isLoading) {
      const cutoff = moment()
        .startOf("day")
        .subtract(30, "days");
      const plays = _.takeWhile(this.playStore.plays, play =>
        play.playDate.isAfter(cutoff)
      );
      return new PlayStats(plays);
    }
    return new PlayStats();
  }

  @computed
  public get thisYearStats() {
    if (!this.playStore.isLoading) {
      const cutoff = moment()
        .startOf("year")
        .subtract(1, "day");
      const plays = _.takeWhile(this.playStore.plays, play =>
        play.playDate.isAfter(cutoff)
      );
      return new PlayStats(plays);
    }
    return new PlayStats();
  }

  @computed
  public get allTimeStats() {
    if (!this.playStore.isLoading) {
      return new PlayStats(this.playStore.plays, this.playStore.playedGames);
    }
    return new PlayStats();
  }

  @computed
  public get collectionStats() {
    if (!this.collectionStore.isLoading) {
      return new CollectionStats(this.collectionStore.allGames);
    }
    return new CollectionStats();
  }
}
