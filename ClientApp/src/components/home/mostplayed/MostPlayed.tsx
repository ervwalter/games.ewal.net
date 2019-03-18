import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import StoresContext from "../../../stores/StoresContext";
import BackToTop from "../core/BackToTop";
import Legend from "./Legend";
import styles from "./MostPlayed.module.scss";
import PlayedGamesTable from "./PlayedGamesTable";

const MostPlayed: SFC<{ visible: boolean }> = observer(({ visible }) => {
	if (!visible) {
		return null;
	}
	const { playStore, statsStore } = useContext(StoresContext);

	return (
		<div className={styles["most-played"]} id="mostPlays">
			<div className="title is-4">
				<BackToTop />
				Most Played Games <Legend stats={statsStore.allTimeStats} />
			</div>
			<PlayedGamesTable games={playStore.playedGames} />
		</div>
	);
});

export default MostPlayed;
