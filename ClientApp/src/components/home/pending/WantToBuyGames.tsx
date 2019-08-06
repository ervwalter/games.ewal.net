import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import StoresContext from "../../../stores/StoresContext";
import BackToTop from "../core/BackToTop";
import Thumbnails from "../core/Thumbnails";
import GameList from "../core/GameList";
import styles from "./UnplayedPreordered.module.scss";

const WantToBuyGames: SFC<{ visible: boolean }> = observer(({ visible }) => {
	const { collectionStore, viewStateStore } = useContext(StoresContext);
	if (!visible) {
		return null;
	}
	const games = collectionStore.wantToBuyGames;
	if (games.length === 0) {
		return null;
	}
	return (
		<div className={styles["pending"]} id="pending">
			<div className="title is-4">
				<BackToTop />
				Games<span className="is-hidden-mobile"> and Expansions</span> I Want to Buy
			</div>
			{viewStateStore.isMobile ? <GameList games={games} /> : <Thumbnails games={games} multiRow={true} />}
		</div>
	);
});

export default WantToBuyGames;
