import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import StoresContext from "../../../stores/StoresContext";
import styles from "./TopTen.module.scss";
import TopTenDesktop from "./TopTenDesktop";
import TopTenMobile from "./TopTenMobile";

const TopTen: SFC<{ visible: boolean }> = observer(({ visible }) => {
	const { topTenStore, viewStateStore } = useContext(StoresContext);

	if (!visible) {
		return null;
	}
	if (topTenStore.games.length === 0) {
		return null;
	}
	return (
		<div className={styles["topten"]} id="topten">
			<div className="title is-4">
				Top 10 Favorite Games
			</div>
			{viewStateStore.isMobile ? (
				<TopTenMobile games={topTenStore.games} />
			) : (
				<TopTenDesktop games={topTenStore.games} />
			)}
		</div>
	);
});

export default TopTen;
