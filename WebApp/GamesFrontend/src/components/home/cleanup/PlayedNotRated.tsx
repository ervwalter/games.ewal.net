import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import StoresContext from "../../../stores/StoresContext";
import GameList from "../core/GameList";
import Thumbnails from "../core/Thumbnails";
import styles from "./PlayedNotRated.module.scss";

const PlayedNotRated: SFC= observer(() => {
	const { playStore, viewStateStore } = useContext(StoresContext);
	const games = playStore.playedNotRated;
	if (games.length === 0) {
		return null;
	}
	return (
		<div className={styles["notrated"]} id="notrated">
			<div className="title">
				Played But Not Rated
			</div>
			{viewStateStore.isMobile ? <GameList games={games} /> : <Thumbnails games={games} multiRow={true} />}
		</div>
	);
});

export default PlayedNotRated;
