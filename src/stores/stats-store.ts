import { computed } from 'mobx';
import playStore, { PlayStore, Play } from './plays-store';
import collectionStore, { CollectionStore, Game } from './collection-store';
import * as _ from 'lodash';
import * as moment from 'moment';

type tbd = number | "...";

class PlayStats {
	readonly numberOfPlays: tbd = "...";
	readonly uniqueGames: tbd = "...";
	readonly namedPlayers: tbd = "...";
	readonly locations: tbd = "...";
	readonly newGames: tbd = "...";
	readonly hoursPlayed: string = "...";

	public constructor(plays?: Play[]) {
		if (plays) {
			this.numberOfPlays = plays.length;
			this.uniqueGames = Object.keys(_.groupBy(plays, (play) => play.gameId)).length;
			let players = new Set<string>();
			let locations = new Set<string>();
			let newGames = 0;
			let duration = 0;

			// process each play
			for (let play of plays) {
				if (play.players) {
					for (let player of play.players) {
						// count how many games are marked as new to me
						if (player.name.toLowerCase() == "erv") {
							if (player.new) {
								newGames++;
							}
						}
						
						// exclude anonymous players from the player count
						if (player.name.toLowerCase() != "anonymous player") {
							players.add(player.name.toLowerCase());
						}
					}
				}

				// calculate the total duration
				if (play.duration > 0) {
					duration += play.duration;
				}
				else if (play.estimatedDuration > 0) {
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
	}

}

class CollectionStats {
	readonly numberOfGames: tbd = "...";
	readonly numberOfExpansions: tbd = "...";
	readonly yetToBePlayed: tbd = "...";
	readonly averageWeight: tbd = "...";
	readonly averageRating: tbd = "...";
	readonly hIndex: tbd = "...";

	public constructor(games?: Game[]) {
		if (games) {
			// exclude games that are not currently owned
			// sort by numPlays so that h-index can be calculated
			let owned = _(games).filter((game) => game.owned).orderBy('numPlays', 'desc').value();

			this.numberOfGames = owned.length;
			this.numberOfExpansions = 0;
			this.yetToBePlayed = 0;
			this.hIndex = 0;
			let weight = 0;
			let weightCount = 0;
			let rating = 0;
			let ratingCount = 0;
			let index = 0;

			// process each owned game
			for (let game of owned) {
				// calculate h-index
				if (++index <= game.numPlays) {
					this.hIndex++;
				}

				// count expansions only if they are listed as 'owned'
				let ownedExpansionsCount = 0;
				if (game.expansions) {
					for (let expansion of game.expansions) {
						if (expansion.owned) {
							this.numberOfExpansions++;
							ownedExpansionsCount++;
						}
					}
				}
				game.ownedExpansionCount = ownedExpansionsCount;

				// how many games have never been played
				if (game.numPlays == 0) {
					this.yetToBePlayed++;
				}

				// average the weights of the owned games
				if (game.averageWeight > 0) {
					weight += game.averageWeight;
					weightCount++;
				}

				// average the ratings for games that have them
				if (game.rating > 0) {
					rating += game.rating;
					ratingCount++;
				}
			}

			// round the averages to 1 decimal place
			this.averageWeight = Math.round(10 * weight / weightCount) / 10;
			this.averageRating = Math.round(10 * rating / ratingCount) / 10;
		}
	}
}

export class StatsStore {
	private collectionStore: CollectionStore;
	private playStore: PlayStore;

	public constructor(playStore: PlayStore, collectionStore: CollectionStore) {
		this.playStore = playStore;
		this.collectionStore = collectionStore;
	}

	@computed public get thirtyDaysStats() {
		if (!this.playStore.isLoading) {
			let cutoff = moment().startOf('day').subtract(30, 'days');
			let plays = _.takeWhile(this.playStore.plays, (play) => play.playDate.isAfter(cutoff));
			return new PlayStats(plays)
		}
		return new PlayStats();
	}

	@computed public get allTimeStats() {
		if (!this.playStore.isLoading) {
			return new PlayStats(this.playStore.plays)
		}
		return new PlayStats();
	}

	@computed public get collectionStats() {
		if (!this.collectionStore.isLoading) {
			return new CollectionStats(this.collectionStore.games)
		}
		return new CollectionStats();
	}

}

const singleton = new StatsStore(playStore, collectionStore);
export default singleton;
