import {observable, action, runInAction} from 'mobx';
import DataProvider from './data-provider';

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
    const games = await data.fetch<Game[]>('/api/collection');
    runInAction(() => {
      this.games = games;
      this.isLoading = false;
    });
  }

}

const singleton = new CollectionStore();
export default singleton;
