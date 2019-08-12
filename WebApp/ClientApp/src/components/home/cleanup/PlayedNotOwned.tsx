import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import StoresContext from "../../../stores/StoresContext";
import GameList from "../core/GameList";
import Thumbnails from "../core/Thumbnails";
import styles from "./PlayedNotOwned.module.scss";

const PlayedNotOwned: SFC<{ visible: boolean }> = observer(({ visible }) => {
	const { playStore, viewStateStore } = useContext(StoresContext);
	if (!visible) {
		return null;
	}
	const games = playStore.playedNotOwned;
	if (games.length === 0) {
		return null;
	}
	return (
		<div className={styles["notowned"]} id="notowned">
			<div className="title">
				Played But Not Owned
			</div>
			{viewStateStore.isMobile ? <GameList games={games} /> : <Thumbnails games={games} multiRow={true} />}
		</div>
	);
});

export default PlayedNotOwned;
