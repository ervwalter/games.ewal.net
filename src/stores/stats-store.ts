import {computed} from 'mobx';
import playStore, {PlayStore}  from './plays-store';
import collectionStore, {CollectionStore} from './collection-store';
import '../interfaces';

class PlayStats {
  @computed get numberOfPlays() {
    if (playStore.isLoading) {
      return "...";
    }
    else {
      return playStore.plays.length;
    }
  }
}

class CollectionStats {
  @computed get numberOfGames() {
    if (collectionStore.isLoading) {
      return "...";
    }
    else {
      return collectionStore.games.length;
    }
  }
}

export class StatsStore {
  private collectionStore: CollectionStore;
  private playStore: PlayStore;

  public constructor(playStore: PlayStore, collectionStore: CollectionStore) {
    this.playStore = playStore;
    this.collectionStore = collectionStore;
    this.thirtyDays = new PlayStats();
    this.allTime = new PlayStats();
    this.collection = new CollectionStats();
  }

  public thirtyDays: PlayStats;
  public allTime: PlayStats;
  public collection: CollectionStats;
  
}

const singleton = new StatsStore(playStore, collectionStore);
export default singleton;
