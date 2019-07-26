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
	const collectionStore = new CollectionStore();
	const playStore = new PlayStore(collectionStore);
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
