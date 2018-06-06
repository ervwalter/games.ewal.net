import _ from "lodash";
import { action, computed, observable, runInAction } from "mobx";
import moment from "moment";
import DataProvider from "~/utils/DataProvider";

type Moment = moment.Moment;

export interface Play {
  playId: string;
  gameId: string;
  name: string;
  image: string;
  thumbnail: string;
  playDate: Moment;
  numPlays: number;
  location: string;
  duration?: number;
  estimatedDuration?: number;
  incomplete: boolean;
  excludeFromStats: boolean;
  players: Player[];
  comments: string;
}

export interface Player {
  name: string;
  username: string;
  userId: string;
  startPosition: string;
  color: string;
  score: string;
  rating: string;
  new: boolean;
  win: boolean;
}

export interface PlayedGame {
  gameId: string;
  name: string;
  image: string;
  thumbnail: string;
  numPlays?: number;
  duration?: number;
}

export class PlayStore {
  @observable public plays: Play[];
  @observable public isLoading: boolean;

  public constructor() {
    this.plays = [];
    this.isLoading = true;
    this.loadPlays();
  }

  @action
  private async loadPlays() {
    const data = new DataProvider();
    // await delay(5000);
    const plays = await data.fetch<any[]>("/api/plays");
    runInAction(() => {
      // process each play
      this.plays = _.orderBy(plays, ["playDate", "playId"], ["desc", "desc"]);
      for (const play of this.plays) {
        play.playDate = moment(play.playDate);
        if (play.location === "") {
          play.location = "Home";
        }
      }
      this.isLoading = false;
    });
  }

  @computed
  get recentGames() {
    return _
      .chain(this.plays)
      .uniqBy(p => p.gameId)
      .map((p: Play) => {
        return {
          gameId: p.gameId,
          name: p.name,
          image: p.image,
          thumbnail: p.thumbnail
        };
      })
      .take(25)
      .value();
  }

  @computed
  get playedGames() {
    return _
      .chain(this.plays)
      .groupBy("gameId")
      .mapValues(plays => {
        return {
          gameId: plays[0].gameId,
          name: plays[0].name,
          image: plays[0].image,
          thumbnail: plays[0].thumbnail,
          numPlays: _.sumBy(plays, play => play.numPlays || 1),
          duration: _.sumBy(plays, play => {
            if (play.duration && play.duration > 0) {
              return play.duration;
            } else if (play.estimatedDuration && play.estimatedDuration > 0) {
              // use the estimated duration of an explicit one was not specified
              return play.estimatedDuration * (play.numPlays || 1);
            } else {
              return 0;
            }
          })
        };
      })
      .values()
      .orderBy(["numPlays", "name"], ["desc", "asc"])
      .value();
  }
}
