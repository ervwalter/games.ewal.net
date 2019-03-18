import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import { Play } from "../../../stores/Models";
import StoresContext from "../../../stores/StoresContext";
import PlaysList from "./PlaysList";
import PlaysTable from "./PlaysTable";
import styles from "./RecentPlayDetails.module.scss";

const RecentPlayDetails: SFC<{ plays: Play[] }> = observer(({ plays }) => {
	const { viewStateStore } = useContext(StoresContext);
	const { isMobile } = viewStateStore;
	if (isMobile) {
		return (
			<div className={styles["recent-plays"]}>
				<PlaysList plays={plays} />{" "}
			</div>
		);
	} else {
		return (
			<div className={styles["recent-plays"]}>
				<PlaysTable plays={plays} />
			</div>
		);
	}
});

export default RecentPlayDetails;
