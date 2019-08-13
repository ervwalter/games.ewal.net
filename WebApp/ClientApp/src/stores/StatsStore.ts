import _ from "lodash";
import { computed } from "mobx";
import moment from "moment";

import CollectionStore from "./CollectionStore";
import { CollectionStats, DayOfWeekStat, Game, MonthStat, Play, PlayStats, PlayedGame, PlayerCountStat } from "./Models";
import PlayStore from "./PlayStore";

class StatsStore {
	public constructor(private playStore: PlayStore, private collectionStore: CollectionStore) {}

	@computed
	public get thirtyDaysStats() {
		if (!this.playStore.isLoading) {
			const cutoff = moment()
				.startOf("day")
				.subtract(30, "days");
			const plays = _.takeWhile(this.playStore.plays, play => play.playDate.isAfter(cutoff));
			return this.calculatePlayStats(plays);
		}
		return this.calculatePlayStats();
	}

	@computed
	public get thisYearStats() {
		if (!this.playStore.isLoading) {
			const cutoff = moment()
				.startOf("year")
				.subtract(1, "day");
			const plays = _.takeWhile(this.playStore.plays, play => play.playDate.isAfter(cutoff));
			return this.calculatePlayStats(plays);
		}
		return this.calculatePlayStats();
	}

	@computed
	public get allTimeStats() {
		if (!this.playStore.isLoading) {
			return this.calculatePlayStats(this.playStore.plays, this.playStore.playedGames);
		}
		return this.calculatePlayStats();
	}

	@computed
	public get collectionStats() {
		if (!this.collectionStore.isLoading) {
			return this.calculatCollectionStats(this.collectionStore.allGames);
		}
		return this.calculatCollectionStats();
	}

	@computed
	public get playsByMonthStats() {
		if (!this.playStore.isLoading) {
			const now = moment();
			const startMonth = moment()
				.add(-11, "months")
				.startOf("month");
			const plays = _.takeWhile(this.playStore.plays, play => play.playDate.isAfter(startMonth));
			const months: MonthStat[] = [];
			const statsByMonth: { [key: string]: MonthStat } = {};

			const thisMonth = now.endOf("month");
			for (let month = startMonth; !month.isAfter(thisMonth); month.add(1, "month")) {
				const monthLabel = month.format("MMM");
				const monthStats = {
					month: monthLabel,
					monthShort: monthLabel.substr(0, 1),
					numberOfPlays: 0,
					hoursPlayed: 0
				};
				months.push(monthStats);
				statsByMonth[monthStats.month] = monthStats;
			}

			plays.forEach(play => {
				const playMonth = play.playDate.format("MMM");
				const monthStats = statsByMonth[playMonth];

				let duration = 0;
				if (play.duration && play.duration > 0) {
					duration += play.duration;
				} else if (play.estimatedDuration && play.estimatedDuration > 0) {
					// use the estimated duration of an explicit one was not specified
					duration += play.estimatedDuration * (play.numPlays || 1);
				}

				duration = Math.round(duration / 60);

				monthStats.numberOfPlays++;
				monthStats.hoursPlayed += duration || 0;
			});
			return months;
		}
		return [];
	}

	@computed
	public get playsByDayOfWeek() {
		if (!this.playStore.isLoading) {
			const playsByDayOfWeek: DayOfWeekStat[] = [];
			const groupedPlays = _.chain(this.playStore.plays)
				.groupBy(p => p.playDate.format("d"))
				.value();
			_.chain(groupedPlays)
				.keys()
				.sort()
				.value()
				.forEach(key => {
					const group = groupedPlays[key];
					playsByDayOfWeek.push({
						day: group[0].playDate.format("ddd"),
						numberOfPlays: _.sumBy(group, g => g.numPlays)
					});
				});
			return playsByDayOfWeek;
		}
		return [];
	}

	@computed
	public get playsByPlayerCount() {
		if (!this.playStore.isLoading) {
			const playsByPlayerCount: PlayerCountStat[] = [];
			const groupedPlays = _.chain(this.playStore.plays)
				.filter(p => p.players.length > 0)
				.groupBy(p => p.players.length)
				.value();
			_.chain(groupedPlays)
				.keys()
				.value()
				.forEach(key => {
					const group = groupedPlays[key];
					playsByPlayerCount.push({
						playerCount: group[0].players.length,
						numberOfPlays: _.sumBy(group, g => g.numPlays)
					});
				});

			return _.sortBy(playsByPlayerCount, p => p.playerCount);
		}
		return [];
	}

	private calculatePlayStats = (plays?: Play[], games?: PlayedGame[]) => {
		let stats: PlayStats = {
			dimes: "...",
			hIndex: "...",
			hoursPlayed: "...",
			locations: "...",
			namedPlayers: "...",
			newGames: "...",
			nickles: "...",
			numberOfPlays: "...",
			quarters: "...",
			uniqueGames: "..."
		};
		if (plays) {
			stats.numberOfPlays = plays.length;
			stats.uniqueGames = Object.keys(_.groupBy(plays, play => play.gameId)).length;
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
					duration += play.estimatedDuration * (play.numPlays || 1);
				}

				// find all the unique locations
				locations.add(play.location.toLowerCase());
			}

			stats.namedPlayers = players.size;
			stats.locations = locations.size;
			stats.newGames = newGames;

			// convert to hours
			duration = Math.round(duration / 60);

			// toLocaleString adds comma separators
			stats.hoursPlayed = "≈" + duration.toLocaleString();
		}

		if (games) {
			stats.hIndex = 0;
			stats.quarters = 0;
			stats.dimes = 0;
			stats.nickles = 0;
			let index = 0;
			for (const game of games) {
				// calculate h-index
				if (++index <= game.numPlays!) {
					stats.hIndex++;
				}

				if (game.numPlays! >= 25) {
					stats.quarters++;
				} else if (game.numPlays! >= 10) {
					stats.dimes++;
				} else if (game.numPlays! >= 5) {
					stats.nickles++;
				}
			}
		}
		return stats;
	};

	private calculatCollectionStats = (games?: Game[]) => {
		let stats: CollectionStats = {
			numberOfGames: "...",
			numberOfExpansions: "...",
			numberOfPreviouslyOwned: "...",
			yetToBePlayed: "...",
			preordered: "...",
			averageRating: "...",
			top100Games: "...",
			wantToBuy: "..."
		};

		if (games) {
			stats.numberOfGames = 0;
			stats.numberOfExpansions = 0;
			stats.numberOfPreviouslyOwned = 0;
			stats.yetToBePlayed = 0;
			stats.preordered = 0;
			stats.top100Games = 0;
			stats.wantToBuy = 0;

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
		}
		return stats;
	};
}

export default StatsStore;
