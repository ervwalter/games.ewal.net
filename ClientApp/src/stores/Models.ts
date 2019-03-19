type Moment = import("moment").Moment;

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
	username?: string;
	userId?: string;
	startPosition?: string;
	color?: string;
	score?: string;
	rating?: string;
	new: boolean;
	win: boolean;
}

export interface GameImage {
	gameId: string;
	name: string;
	image: string;
	thumbnail: string;
}

export interface PlayedGame {
	gameId: string;
	name: string;
	image: string;
	thumbnail: string;
	numPlays?: number;
	duration?: number;
}

export interface Game {
	gameId: string;
	name: string;
	sortableName: string;
	shortName?: string;
	sortableShortName?: string;
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
	allExpansions?: Game[];
	ownedExpansionCount?: number;
}

type TBD = number | "...";

export interface PlayStats {
	numberOfPlays: TBD;
	uniqueGames: TBD;
	namedPlayers: TBD;
	locations: TBD;
	newGames: TBD;
	hoursPlayed: string;
	quarters: TBD;
	dimes: TBD;
	nickles: TBD;
	hIndex: TBD;
}

export interface CollectionStats {
	numberOfGames: TBD;
	numberOfExpansions: TBD;
	numberOfPreviouslyOwned: TBD;
	yetToBePlayed: TBD;
	preordered: TBD;
	averageRating: TBD;
	top100Games: TBD;
}

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