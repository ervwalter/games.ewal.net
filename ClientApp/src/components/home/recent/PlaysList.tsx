import React, { SFC } from "react";

import { Play } from "../../../stores/Models";
import Players from "./Players";
import styles from "./PlaysList.module.scss";

const PlaysList: SFC<{ plays: Play[] }> = React.memo(({ plays }) => (
	<div className={styles["plays-list"]}>
		{plays.map(play => (
			<div key={play.playId} className={styles["play"]}>
				<div className="columns is-mobile is-gapless">
					<div className="column">
						<div>
							<a target="_blank" href={`https://boardgamegeek.com/boardgame/${play.gameId}/`}>
								{play.name}
							</a>
						</div>
					</div>
					<div className="column is-narrow">{play.playDate.format("MMM D")}</div>
				</div>
				<div className={styles["play-details"]}>
					<Players players={play.players} /> - <span className={styles["location"]}>@{play.location}</span>
				</div>
			</div>
		))}
	</div>
));

export default PlaysList;
