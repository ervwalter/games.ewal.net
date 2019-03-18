import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import StoresContext from "../../../stores/StoresContext";
import BackToTop from "../core/BackToTop";
import Thumbnails from "../core/Thumbnails";
import GameList from "./GameList";
import styles from "./UnplayedPreordered.module.scss";

const PreorderedGames: SFC<{ visible: boolean }> = observer(({ visible }) => {
	if (!visible) {
		return null;
	}
	const { collectionStore, viewStateStore } = useContext(StoresContext);
	const games = collectionStore.preorderedGames;
	return (
		<div className={styles["pending"]} id="pending">
			<div className="title is-4">
				<BackToTop />
				Preordered Games<span className="is-hidden-mobile"> and Expansions</span>
			</div>
			{viewStateStore.isMobile ? <GameList games={games} /> : <Thumbnails games={games} multiRow={true} />}
		</div>
	);
});

export default PreorderedGames;
