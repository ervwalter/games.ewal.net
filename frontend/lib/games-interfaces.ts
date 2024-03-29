export interface Play {
  playId: string;
  gameId: string;
  name: string;
  sortableName: string;
  image: string;
  thumbnail: string;
  playDate: string;
  numPlays: number;
  location?: string;
  duration?: number;
  estimatedDuration?: number;
  incomplete: boolean;
  excludeFromStats: boolean;
  players: Player[];
  comments: string;
  rating?: number;
  cooperativeGame: boolean;
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
  wishListPriority: number;
  collectingOnly: boolean;
  userComment: string;
  ownedExpansions?: Game[];
  allExpansions?: Game[];
  ownedExpansionCount?: number;
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

export interface PlayStats {
  numberOfPlays: number;
  uniqueGames: number;
  namedPlayers: number;
  locations: number;
  newGames: number;
  hoursPlayed: number;
  quarters: number;
  dimes: number;
  nickles: number;
}

export interface CollectionStats {
  numberOfGames: number;
  numberOfExpansions: number;
  numberOfPreviouslyOwned: number;
  yetToBePlayed: number;
  preordered: number;
  wantToBuy: number;
  averageRating: number;
  top100Games: number;
}

export interface Stats {
  collection: CollectionStats;
  playsAllTime: PlayStats;
  playsThisYear: PlayStats;
  thisYear: number;
}
