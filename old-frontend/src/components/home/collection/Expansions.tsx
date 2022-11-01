import cx from "classnames";
import _ from "lodash";
import React, { SFC } from "react";

import { Game } from "../../../stores/Models";
import styles from "./Expansions.module.scss";

const Expansions: SFC<{ game: Game }> = React.memo(({ game }) => {
	if (game.expansions) {
		const maxIndex = game.expansions.length - 1;
		return (
			<div className={styles["expansions"]}>
				<span className={styles["count"]}>{game.ownedExpansionCount} expansions</span>
				<div className={cx("box", styles["tip"])}>
					{_.sortBy(game.expansions, "sortableShortName").map((expansion, index) => {
						return (
							<div key={expansion.gameId}>
								{expansion.shortName}
								{index < maxIndex ? "," : ""}
							</div>
						);
					})}
				</div>
			</div>
		);
	} else {
		return null;
	}
});

export default Expansions;
