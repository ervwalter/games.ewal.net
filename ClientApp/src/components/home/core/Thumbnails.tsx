import cx from "classnames";
import React, { SFC } from "react";

import { GameImage } from "../../../stores/Models";
import styles from "./Thumbnails.module.scss";

const Thumbnails: SFC<{ games: GameImage[]; multiRow?: boolean }> = React.memo(({ games, multiRow = false }) => {
	return (
		<div className={cx(styles["thumbnails"], multiRow && styles["multi-row"], "is-hidden-mobile")}>
			{games.map(game => (
				<a
					href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}
					target="_blank" rel="noopener noreferrer"
					key={game.gameId}
					className="fade-in">
					<img src={game.thumbnail} alt={game.name} title={game.name} />
				</a>
			))}
		</div>
	);
});

export default Thumbnails;
