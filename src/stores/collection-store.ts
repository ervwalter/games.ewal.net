import { observable, computed, action, runInAction } from 'mobx';
import DataProvider from './data-provider';
import * as _ from 'lodash';

export interface Game {
	gameId: string;
	name: string;
	sortableName: string;
	description?: string;
	image: string;
	thumbnail: string;
	isExpansion: boolean;
	yearPublished: number;
	minPlayers: number;
	maxPlayers: number;
	playingTime?: number;
	minPlayingTime?: number;
	maxPlayingTime?: number;
	mechanics: string[];
	bggRating?: number;
	averageRating?: number;
	rank?: number;
	averageWeight?: number;
	designers: string[];
	publishers: string[];
	artists: string[];
	rating?: number;
	numPlays: number;
	owned: boolean;
	preOrdered: boolean;
	forTrade: boolean;
	previousOwned: boolean;
	want: boolean;
	wantToBuy: boolean;
	wantToPlay: boolean;
	wishList: boolean;
	userComment: string;
	expansions?: Game[];
	ownedExpansionCount?: number;
}

export type SortColumns = "sortableName" | "numPlays" | "rating";
type SortDirection = "asc" | "desc";

export class CollectionStore {
	@observable private sortBy: SortColumns = "sortableName";
	@observable private sortDirection: SortDirection = "asc";

	@observable public games: Game[];
	@observable public isLoading: boolean;

	public constructor() {
		this.games = [];
		this.isLoading = true;

		this.loadGames();
	}

	@computed public get sortedGames() {
		let result = _.orderBy(this.games, this.sortBy, this.sortDirection);
		return result;
	}

	@action public changeSort(sortBy: SortColumns) {
		if (this.sortBy === sortBy) {
			if (this.sortDirection === 'asc') {
				this.sortDirection = 'desc';
			}
			else {
				this.sortDirection = 'asc';
			}
		}
		else {
			this.sortBy = sortBy;
			if (sortBy === 'sortableName') {
				this.sortDirection = 'asc';
			}
			else {
				this.sortDirection = 'desc';
			}
		}
	}

	@action private async loadGames() {
		let data = new DataProvider();
		const games = await data.fetch<Game[]>('/api/collection');
		runInAction(() => {
			this.games = _.filter(games, (game) => game.owned);
			for (let game of this.games) {
				if (!(game.rating > 0)) {
					game.rating = 0;
				}
				game.ownedExpansionCount = 0;
				if (game.expansions) {
					let parentName = game.name.toLowerCase();
					game.expansions = _.filter(game.expansions, (expansion) => expansion.owned);
					game.ownedExpansionCount = game.expansions.length;
					for (let expansion of game.expansions) {
						if (expansion.name.toLowerCase().substr(0, parentName.length) === parentName) {
							let shortName = expansion.name.substr(parentName.length).trim();
							expansion.name = shortName;
							if (!shortName.toLowerCase().match(/^[a-z]/)) {
								expansion.name = trimStart(shortName, '–', '-', ':', ' ');
								expansion.sortableName = expansion.name.toLowerCase().trim().replace(/^the\ |a\ |an\ /, '');
							}
						}
					}
				}
			}
			this.isLoading = false;
		});
	}

}

function trimStart(source: string, ...characters: string[]) {
	var i, _ref;
	if (source.length === 0) {
		return source;
	}
	if (characters == null) {
		characters = [' '];
	}
	i = 0;
	while ((_ref = source.charAt(i), characters.indexOf(_ref) >= 0) && i < source.length) {
		i++;
	}
	return source.substring(i);
};

const singleton = new CollectionStore();
export default singleton;
