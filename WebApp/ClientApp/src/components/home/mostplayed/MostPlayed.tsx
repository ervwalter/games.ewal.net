import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import StoresContext from "../../../stores/StoresContext";
import Legend from "./Legend";
import styles from "./MostPlayed.module.scss";
import PlayedGamesTable from "./PlayedGamesTable";

const MostPlayed: SFC= observer(() => {
	const { playStore, statsStore } = useContext(StoresContext);
	return (
		<div className={styles["most-played"]} id="mostplays">
			<div className="title">
				Most Played Games <Legend stats={statsStore.allTimeStats} />
			</div>
			<PlayedGamesTable games={playStore.playedGames} />
		</div>
	);
});

export default MostPlayed;
