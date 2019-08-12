import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import StoresContext from "../../../stores/StoresContext";
import GameList from "../core/GameList";
import Thumbnails from "../core/Thumbnails";
import styles from "./UnplayedPreordered.module.scss";

const UnplayedGames: SFC = observer(() => {
	const { collectionStore, viewStateStore } = useContext(StoresContext);
	const games = collectionStore.unplayedGames;
	if (games.length === 0) {
		return null;
	}
	return (
		<div className={styles["pending"]} id="comingsoon">
			<div className="title">
				<span className="is-hidden-mobile">Patiently </span>Waiting to be Played
			</div>
			{viewStateStore.isMobile ? <GameList games={games} /> : <Thumbnails games={games} multiRow={true} />}
		</div>
	);
});

export default UnplayedGames;
