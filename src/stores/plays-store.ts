import {observable, computed, action, runInAction} from 'mobx';
import DataProvider from './data-provider';
import '../interfaces';

export class PlayStore {
  @observable public plays: Play[];
  @observable public isLoading: boolean;

  public constructor() {
    this.plays = [];
    this.isLoading = true;
    this.loadPlays();    
  }

  @action private async loadPlays() {
    let data = new DataProvider();
    const plays = await data.fetch('/api/plays');
    runInAction(() => {
      this.plays = plays;
      this.isLoading = false;
    });
  }

  @computed public get count() {
    return this.plays.length;
  }

}

const singleton = new PlayStore();
export default singleton;
