import {observable, computed, action, runInAction} from 'mobx';
import DataProvider from './data-provider';
import * as moment from 'moment';
import * as _ from 'lodash';

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
}

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
		//await delay(5000);
		const plays = await data.fetch<any[]>('/api/plays');
		runInAction(() => {
			// process each play
			for (let play of plays) {
				play.playDate = moment(play.playDate);
				if (play.location == "") {
					play.location = "Home";
				}
			}
			this.plays = plays;
			this.isLoading = false;
		});
	}

	@computed get recentGames() {
		return _(this.plays)
			.uniqBy(p => p.gameId)
			.map<PlayedGame>(p =>{
				return {
					gameId: p.gameId,
					name: p.name,
					image: p.image,
					thumbnail: p.thumbnail
				}
			})
			.take(25)
			.value();
	}
}

// function delay(ms:number) {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

const singleton = new PlayStore();
export default singleton;
