import cx from "classnames";
import React, { SFC } from "react";

import { Play } from "../../../stores/Models";
import Players from "./Players";
import styles from "./PlaysTable.module.scss";

const PlaysTable: SFC<{ plays: Play[] }> = React.memo(({ plays }) => (
	<table className={cx("table", "is-striped", styles["plays-table"])}>
		<thead>
			<tr>
				<th>Date</th>
				<th>Game</th>
				<th>Players</th>
				<th>Location</th>
			</tr>
		</thead>
		<tbody>
			{plays.map(play => (
				<tr key={play.playId}>
					<td>
						<span className="is-hidden-touch">{play.playDate.format("ddd")}, </span>
						{play.playDate.format("MMM D")}
					</td>
					<td className="name">
						<a target="_blank" href={`https://boardgamegeek.com/boardgame/${play.gameId}/`}>
							{play.name}
						</a>
					</td>
					<td className="players-column">
						<Players players={play.players} />
					</td>
					<td>{play.location}</td>
				</tr>
			))}
		</tbody>
	</table>
));

export default PlaysTable;
