import { Play } from "./models";

export function duration(play: Play): number {
  if (play.duration && play.duration > 0) {
    return play.duration;
  } else if (play.estimatedDuration && play.estimatedDuration > 0) {
    // use the estimated duration of an explicit one was not specified
    return play.estimatedDuration * (play.numPlays || 1);
  }
  return 0;
}
