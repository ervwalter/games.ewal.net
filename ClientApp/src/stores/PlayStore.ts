import axios from "axios";
import _ from "lodash";
import { action, computed, observable, runInAction } from "mobx";
import moment from "moment";

import { GameImage, Play, Game, PlayedGame } from "./Models";
import CollectionStore from "./CollectionStore";

class PlayStore {
	@observable public plays: Play[];
	@observable public isLoading: boolean;

	private collectionStore: CollectionStore;

	public constructor(collectionStore: CollectionStore) {
		this.plays = [];
		this.isLoading = true;
		this.collectionStore = collectionStore;
		this.loadPlays();
	}

	@action
	private async loadPlays() {
		const response = await axios.get("/api/plays");
		const plays = response.data as Play[];
		runInAction(() => {
			// process each play
			this.plays = _.orderBy(plays, ["playDate", "playId"], ["desc", "desc"]);
			for (const play of this.plays) {
				play.playDate = moment(play.playDate);
				if (play.location === "") {
					play.location = "Home";
				}
			}
			this.isLoading = false;
		});
	}

	@computed
	get recentThumbnails() {
		return _.chain(this.plays)
			.uniqBy(p => p.gameId)
			.map(
				(p: Play): GameImage => {
					return {
						gameId: p.gameId,
						name: p.name,
						image: p.image,
						thumbnail: p.thumbnail
					};
				}
			)
			.take(25)
			.value();
	}

	@computed
	get playedGames() {
		return _.chain(this.plays)
			.groupBy("gameId")
			.mapValues(plays => {
				return this.playsToPlayedGame(plays);
			})
			.values()
			.orderBy(["numPlays", "name"], ["desc", "asc"])
			.value();
	}

	@computed
	public get playedNotOwned(): PlayedGame[] {
		if (this.collectionStore.isLoading) {
			return [];
		}
		const playedGames = _.chain(this.plays)
			.groupBy("gameId")
			.mapValues(plays => {
				return this.playsToPlayedGame(plays);
			})
			.values()
			.value();
		const notOwned: { [key: string]: PlayedGame } = {};
		playedGames.forEach((playedGame) => {
			const game = this.collectionStore.gamesById[playedGame.gameId];
			if (game) {
				if (!game.owned && !game.previousOwned) {
					notOwned[playedGame.gameId] = playedGame;
				}
			}
			else {
				notOwned[playedGame.gameId] = playedGame
			}
		});

		return _.chain(notOwned).values().sortBy("lastPlayDate").reverse().value();
	}

	@computed
	public get playedNotRated(): PlayedGame[] {
		if (this.collectionStore.isLoading) {
			return [];
		}
		const playedGames = _.chain(this.plays)
			.groupBy("gameId")
			.mapValues(plays => {
				return this.playsToPlayedGame(plays);
			})
			.values()
			.orderBy(["numPlays", "name"], ["desc", "asc"])
			.value();
		const notPlayed: { [key: string]: PlayedGame } = {};
		playedGames.forEach((playedGame) => {
			const game = this.collectionStore.gamesById[playedGame.gameId];
			if (game) {
				if (!game.rating) {
					notPlayed[playedGame.gameId] = playedGame;
				}
			}
			else {
				notPlayed[playedGame.gameId] = playedGame
			}
		});

		return _.chain(notPlayed).values().sortBy("lastPlayDate").reverse().value();
	}

	private playsToPlayedGame(plays: Play[]): PlayedGame {
		return {
			gameId: plays[0].gameId,
			name: plays[0].name,
			image: plays[0].image,
			rating: plays[0].rating,
			thumbnail: plays[0].thumbnail,
			numPlays: _.sumBy(plays, play => play.numPlays || 1),
			duration: _.sumBy(plays, play => {
				if (play.duration && play.duration > 0) {
					return play.duration;
				} else if (play.estimatedDuration && play.estimatedDuration > 0) {
					// use the estimated duration of an explicit one was not specified
					return play.estimatedDuration * (play.numPlays || 1);
				} else {
					return 0;
				}
			}),
			lastPlayDate: _.chain(plays).sortBy("playDate", play => play.playDate).last().value().playDate
		};

	}
}

export default PlayStore;
