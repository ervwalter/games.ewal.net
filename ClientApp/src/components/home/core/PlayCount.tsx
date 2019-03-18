import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { SFC } from "react";

import styles from "./PlayCount.module.scss";

const PlayCount: SFC<{ plays: number }> = React.memo(({ plays }) => {
	if (plays > 0) {
		return (
			<span>
				<span className="is-hidden-mobile">Played </span>
				<b>{plays}</b> time{plays > 1 ? "s" : ""}
			</span>
		);
	} else {
		return <span>—</span>;
	}
});

export default PlayCount;
