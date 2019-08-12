import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import StoresContext from "../../../stores/StoresContext";
import GameList from "../core/GameList";
import Thumbnails from "../core/Thumbnails";
import styles from "./UnplayedPreordered.module.scss";

const WantToBuyGames: SFC = observer(() => {
	const { collectionStore, viewStateStore } = useContext(StoresContext);
	const games = collectionStore.wantToBuyGames;
	if (games.length === 0) {
		return null;
	}
	return (
		<div className={styles["pending"]} id="comingsoon">
			<div className="title">
				Games<span className="is-hidden-mobile"> and Expansions</span> I Want to Buy
			</div>
			{viewStateStore.isMobile ? <GameList games={games} /> : <Thumbnails games={games} multiRow={true} />}
		</div>
	);
});

export default WantToBuyGames;
