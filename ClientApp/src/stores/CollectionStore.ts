import axios from "axios";
import _ from "lodash";
import { action, computed, observable, runInAction } from "mobx";

import { Game } from "./Models";

export type SortColumns = "sortableName" | "numPlays" | "rating";
type SortDirection = "asc" | "desc";

class CollectionStore {
	@observable public games: Game[];
	@observable public allGames: Game[];
	@observable public isLoading: boolean;

	@observable private sortBy: SortColumns = "sortableName";
	@observable private sortDirection: SortDirection = "asc";

	public constructor() {
		this.games = [];
		this.allGames = [];
		this.isLoading = true;

		this.loadGames();
	}

	@computed
	public get sortedGames() {
		const result = _.orderBy(this.games, this.sortBy, this.sortDirection);
		return result;
	}

	@computed
	public get unplayedGames() {
		return _(this.games)
			.filter(game => game.numPlays === 0)
			.sortBy("sortableName")
			.value();
	}

	@computed
	public get preorderedGames() {
		const preordered: Game[] = [];
		for (const game of this.allGames) {
			if (game.preOrdered) {
				preordered.push(game);
			}
			if (game.allExpansions) {
				for (const expansion of game.allExpansions) {
					if (expansion.preOrdered) {
						preordered.push(expansion);
					}
				}
			}
		}
		return _.sortBy(preordered, "sortableName");
	}

	@action
	public changeSort(sortBy: SortColumns) {
		if (this.sortBy === sortBy) {
			if (this.sortDirection === "asc") {
				this.sortDirection = "desc";
			} else {
				this.sortDirection = "asc";
			}
		} else {
			this.sortBy = sortBy;
			if (sortBy === "sortableName") {
				this.sortDirection = "asc";
			} else {
				this.sortDirection = "desc";
			}
		}
	}

	@action
	private async loadGames() {
		const response = await axios.get("/api/collection");
		const games = response.data as Game[];

		runInAction(() => {
			for (const game of games) {
				if (!game.rating || !(game.rating > 0)) {
					game.rating = 0;
				}
				game.ownedExpansionCount = 0;
				if (game.expansions) {
					game.allExpansions = game.expansions;
					game.expansions = _.filter(game.expansions, expansion => expansion.owned);
					game.ownedExpansionCount = game.expansions.length;
				}
			}
			this.allGames = games;
			this.games = _.filter(games, game => game.owned);
			this.isLoading = false;
		});
	}
}

export default CollectionStore;
