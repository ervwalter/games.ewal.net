import { groupBy, maxBy, orderBy, sumBy } from "lodash";
import { Play, PlayedGame } from "./models";

export function groupPlays(plays: Play[]) {
  let games = Object.values(groupBy(plays, "gameId")).map((group) => {
    const playedGame: PlayedGame = {
      gameId: group[0].gameId,
      name: group[0].name,
      image: group[0].image,
      rating: group[0].rating,
      thumbnail: group[0].thumbnail,
      lastPlayDate: maxBy(group, "playDate")?.playDate || "",
      duration: sumBy(group, (p) => duration(p)),
      numPlays: sumBy(group, (p) => p.numPlays || 1),
    };
    return playedGame;
  });
  games = orderBy(games, ["numPlays", "name"], ["desc", "asc"]);
  return games;
}

export function duration(play: Play): number {
  if (play.duration && play.duration > 0) {
    return play.duration;
  } else if (play.estimatedDuration && play.estimatedDuration > 0) {
    // use the estimated duration of an explicit one was not specified
    return play.estimatedDuration * (play.numPlays || 1);
  }
  return 0;
}
