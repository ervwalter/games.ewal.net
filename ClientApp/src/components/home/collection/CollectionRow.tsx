import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { SFC } from "react";

import { Game } from "../../../stores/Models";
import PlayCount from "../core/PlayCount";
import Rating from "../core/Rating";
import styles from "./CollectionRow.module.scss";
import Expansions from "./Expansions";

const CollectionRow: SFC<{ game: Game }> = React.memo(({ game }) => {
	return (
		<tr className={styles["row"]}>
			<td className={styles["name"]}>
				<a target="_blank" href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}>
					{game.name}
				</a>
				{game.ownedExpansionCount! > 0 && <Expansions game={game} />}
			</td>
			<td>
				<PlayCount plays={game.numPlays} />
			</td>
			<td className={styles["rating"]}>
				<Rating rating={game.rating} />
			</td>
		</tr>
	);
});

export default CollectionRow;
