import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import StoresContext from "../../../stores/StoresContext";
import BackToTop from "../core/BackToTop";
import Thumbnails from "../core/Thumbnails";
import GameList from "./GameList";
import styles from "./UnplayedPreordered.module.scss";

const UnplayedGames: SFC<{ visible: boolean }> = observer(({ visible }) => {
	if (!visible) {
		return null;
	}
	const { collectionStore, viewStateStore } = useContext(StoresContext);
	const games = collectionStore.unplayedGames;
	return (
		<div className={styles["pending"]} id="pending">
			<div className="title is-4">
				<BackToTop />
				<span className="is-hidden-mobile">Patiently </span>Waiting to be Played
			</div>
			{viewStateStore.isMobile ? <GameList games={games} /> : <Thumbnails games={games} multiRow={true} />}
		</div>
	);
});

export default UnplayedGames;
