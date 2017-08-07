import { observable, action, runInAction } from 'mobx';
import DataProvider from './data-provider';

export interface TopTenItem {
	rank?: number;
	gameId: string;
	name: string;
	description?: string;
	image: string;
	thumbnail: string;
	yearPublished: number;
	mechanics: string[];
	designers: string[];
	rating?: number;
	numPlays: number;
}

export class TopTenStore {
	@observable public games: TopTenItem[];
	@observable public isLoading: boolean;

	public constructor() {
		this.games = [];
		this.isLoading = true;

		this.loadGames();
	}

	@action private async loadGames() {
		let data = new DataProvider();
		const games = await data.fetch<TopTenItem[]>('/api/topten');
		runInAction(() => {
			for (let game of games) {
				if (!(game.rating > 0)) {
					game.rating = 0;
				}
            }
            this.games = games;
			this.isLoading = false;
		});
	}

}

const singleton = new TopTenStore();
export default singleton;
