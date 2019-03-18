import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { SFC } from "react";

import { Game } from "../../../stores/Models";
import styles from "./GameList.module.scss";

const GameList: SFC<{ games: Game[] }> = React.memo(({ games }) => {
	return (
		<div className="content">
			<ul className={styles["list"]}>
				{games.map(game => (
					<li key={game.gameId}>
						<a href={`https://boardgamegeek.com/boardgame/${game.gameId}/`} target="_blank">
							{game.name}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
});

export default GameList;
