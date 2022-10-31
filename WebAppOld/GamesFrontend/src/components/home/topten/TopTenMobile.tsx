import React, { SFC } from "react";

import { TopTenItem } from "../../../stores/Models";
import Rating from "../core/Rating";
import styles from "./TopTenMobile.module.scss";

const TopTenMobile: SFC<{ games: TopTenItem[] }> = React.memo(({ games }) => {
	return (
		<div className={styles["list"]}>
			<table className="table is-striped">
				<thead>
					<tr>
						<th className={styles["rank"]}>Rank</th>
						<th>Name</th>
						<th className={styles["rating"]}>Rating</th>
					</tr>
				</thead>
				<tbody>
					{games.map(game => (
						<tr key={game.gameId}>
							<td className={styles["rank"]}>#{game.rank}</td>
							<td className={styles["name"]}>
								<a target="_blank" rel="noopener noreferrer" href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}>
									{game.name}
								</a>
							</td>
							<td className={styles["rating"]}>
								<Rating rating={game.rating} />
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
});

export default TopTenMobile;
