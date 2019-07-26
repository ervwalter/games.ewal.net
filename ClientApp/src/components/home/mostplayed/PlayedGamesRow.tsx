import cx from "classnames";
import numeral from "numeral";
import React, { SFC } from "react";

import { PlayedGame } from "../../../stores/Models";
import PlayCount from "../core/PlayCount";
import styles from "./PlayedGamesRow.module.scss";

const PlayedGamesRow: SFC<{ game: PlayedGame; rank: number }> = React.memo(({ game, rank }) => {
	const numPlays = game.numPlays;
	if (!numPlays) {
		return null;
	}
	let category = "none";
	if (numPlays >= 25) {
		category = "quarter";
	} else if (numPlays >= 10) {
		category = "dime";
	} else if (numPlays >= 5) {
		category = "nickel";
	}
	return (
		<tr className={cx(styles[category], styles["row"])}>
			<td className={styles["rank"]}>{rank + 1}</td>

			<td className={styles["name"]}>
				<a target="_blank" rel="noopener noreferrer" href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}>
					{game.name}
				</a>
			</td>
			<td>
				<PlayCount plays={numPlays!} />
			</td>
			<td className={styles["duration"]}>≈{numeral(game.duration! / 60).format("0,0")}</td>
		</tr>
	);
});

export default PlayedGamesRow;
