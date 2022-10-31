import React, { SFC } from "react";

import { PlayStats } from "../../../stores/Models";
import styles from "./Legend.module.scss";

const Legend: SFC<{ stats: PlayStats }> = React.memo(({ stats }) => (
	<div className={styles["legend"]}>
		<div className={styles["stat"]}>
			<div className={styles["nickels"]}>{stats.nickles}</div> nickels
		</div>
		<div className={styles["stat"]}>
			<div className={styles["dimes"]}>{stats.dimes}</div> dimes
		</div>
		<div className={styles["stat"]}>
			<div className={styles["quarters"]}>{stats.quarters}</div> quarters
		</div>
	</div>
));

export default Legend;
