import cx from "classnames";
import _ from "lodash";
import React, { SFC } from "react";

import { Player } from "../../../stores/Models";
import styles from "./Players.module.scss";

const Players: SFC<{ players: Player[] }> = React.memo(({ players }) => {
	players = _.sortBy(players, "name");

	// the following line actually removes the elements from the array, and doesn't just count them
	const anonymousCount = _.remove(players, p => p.name.toLowerCase() === "anonymous player").length;

	if (anonymousCount > 0) {
		players.push({
			name: `and ${anonymousCount} other${anonymousCount > 1 ? "s" : ""}`,
			new: false,
			win: false
		});
	}
	const playerCount = players.length;
	return (
		<div className={styles["players"]}>
			{players.map((player, index) => (
				<span className={styles["player"]} key={player.name}>
					<span
						className={cx(player.win && styles["winner"], player.new && styles["new"])}
						title={cx(player.win && "Winner!", player.new && "New!")}>
						{player.name}
					</span>
					{index < playerCount - 1 && <span>,&nbsp;</span>}
				</span>
			))}
		</div>
	);
});

export default Players;
