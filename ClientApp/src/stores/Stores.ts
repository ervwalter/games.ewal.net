import CollectionStore from "./CollectionStore";
import PlayStore from "./PlayStore";
import StatsStore from "./StatsStore";
import TopTenStore from "./TopTenStore";
import { ViewStateStore } from "./ViewStateStore";

export interface IStores {
	playStore: PlayStore;
	collectionStore: CollectionStore;
	statsStore: StatsStore;
	topTenStore: TopTenStore;
	viewStateStore: ViewStateStore;
}

export const createStores = () => {
	const playStore = new PlayStore();
	const collectionStore = new CollectionStore();
	const statsStore = new StatsStore(playStore, collectionStore);
	const topTenStore = new TopTenStore();
	const viewStateStore = new ViewStateStore();
	return {
		playStore,
		collectionStore,
		statsStore,
		topTenStore,
		viewStateStore
	};
};
