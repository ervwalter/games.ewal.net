import axios from "axios";
import _ from "lodash";
import { action, computed, observable, runInAction } from "mobx";
import moment from "moment";

import { GameImage, Play, Game } from "./Models";
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
				return {
					gameId: plays[0].gameId,
					name: plays[0].name,
					image: plays[0].image,
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
					})
				};
			})
			.values()
			.orderBy(["numPlays", "name"], ["desc", "asc"])
			.value();
	}

	@computed
	public get playedNotOwned() {
		if (this.collectionStore.isLoading) {
			return [];
		}
		const notOwned: { [key: string]: Game } = {};
		this.plays.forEach((play) => {
			const game = this.collectionStore.gamesById[play.gameId];
			if (game) {
				if (!game.owned && !game.previousOwned) {
					notOwned[game.gameId] = game;
				}
			}
		});

		return _.chain(notOwned).values().orderBy("sortableName").value();
	}
}

export default PlayStore;
