import axios from "axios";
import { action, observable, runInAction } from "mobx";

import { TopTenItem } from "./Models";

class TopTenStore {
	@observable public games: TopTenItem[];
	@observable public isLoading: boolean;

	public constructor() {
		this.games = [];
		this.isLoading = true;

		this.loadGames();
	}

	@action
	private async loadGames() {
		const response = await axios.get("/api/topten");
		const games = response.data as TopTenItem[];

		runInAction(() => {
			for (const game of games) {
				if (!game.rating || !(game.rating > 0)) {
					game.rating = 0;
				}
			}
			this.games = games;
			this.isLoading = false;
		});
	}
}

export default TopTenStore;
