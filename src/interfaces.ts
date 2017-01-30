interface Play {
  playId: string;
  gameId: string;
  name: string;
  image: string;
  thumbnail: string;
  playDate: string;
  numPlays: number;
  location: string;
  duration: number;
  incomplete: boolean;
  excludeFromStats: boolean;
  players: Player[];
  comments: string;
}

interface Player {
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

interface Game {
  gameId: string;
  name: string;
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
}