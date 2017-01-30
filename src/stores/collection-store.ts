import {observable, action, runInAction} from 'mobx';
import DataProvider from './data-provider';
import '../interfaces';

export class CollectionStore {
  @observable public games: Game[];
  @observable public isLoading: boolean;

  public constructor() {
    this.games = [];
    this.isLoading = true;
    
    this.loadGames();
  }

  @action private async loadGames() {
    let data = new DataProvider();
    const games = await data.fetch('/api/collection');
    runInAction(() => {
      this.games = games;
      this.isLoading = false;
    });
  }

}

const singleton = new CollectionStore();
export default singleton;
