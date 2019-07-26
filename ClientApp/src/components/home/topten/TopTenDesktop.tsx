import cx from "classnames";
import React, { SFC } from "react";

import { TopTenItem } from "../../../stores/Models";
import PlayCount from "../core/PlayCount";
import Rating from "../core/Rating";
import styles from "./TopTenDesktop.module.scss";

const TopTenDesktop: SFC<{ games: TopTenItem[] }> = React.memo(({ games }) => {
	return (
		<div className={styles["list"]}>
			{games.map(game => (
				<div className="columns" key={game.gameId}>
					<div className={cx("column", "is-narrow", styles["rank"])}>
						<span className="">
							#<b>{game.rank}</b>
						</span>
					</div>
					<div className={cx("column", "is-narrow", styles["thumbnail"])}>
						<img src={game.thumbnail.replace("_t.", "_t.")} alt=""/>
					</div>
					<div className="column">
						<div className="content">
							<p>
								<span className={styles["title"]}>
									<a
										className={styles["name"]}
										target="_blank" rel="noopener noreferrer"
										href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}>
										{game.name}
									</a>{" "}
									({game.yearPublished})
								</span>
								<span className={styles["subtitle"]}>
									<PlayCount plays={game.numPlays} /> • Rating: <Rating rating={game.rating} /> •
									Designed By:{" "}
									<span className={styles["designers"]}>{game.designers.join(", ")}</span>{" "}
								</span>
								<span className={styles["mechanics"]}>{game.mechanics.join(" • ")}</span>
							</p>
							<p className={styles["description"]}>{game.description}</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
});

export default TopTenDesktop;
