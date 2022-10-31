import React, { SFC } from "react";

import { PlayedGame } from "../../../stores/Models";
import PlayedGamesRow from "./PlayedGamesRow";
import styles from "./PlayedGamesTable.module.scss";

const PlayedGamesTable: SFC<{ games: PlayedGame[] }> = React.memo(({ games }) => {
	return (
		<div className={styles["games"]}>
			<table className="table">
				<thead>
					<tr>
						<th className={styles["rank"]}>#</th>
						<th>Name</th>
						<th>
							<span className="is-hidden-mobile">Times </span>Played
						</th>
						<th className={styles["duration"]}>
							Hours<span className="is-hidden-mobile"> Played</span>
						</th>
					</tr>
				</thead>
				<tbody>
					{games.map((game, index) => (
						<PlayedGamesRow game={game} rank={index} key={game.gameId} />
					))}
				</tbody>
			</table>
		</div>
	);
});

export default PlayedGamesTable;
