import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import StoresContext from "../../../stores/StoresContext";
import GameList from "../core/GameList";
import Thumbnails from "../core/Thumbnails";
import styles from "./OrphanedExpansions.module.scss";

const OrphanedExpansions: SFC = observer(() => {
	const { collectionStore, viewStateStore } = useContext(StoresContext);
	const games = collectionStore.orphanedExpansions;
	if (games.length === 0) {
		return null;
	}
	return (
		<div className={styles["orphans"]} id="notoorphanswned">
			<div className="title">Orphaned Expansions</div>
			{viewStateStore.isMobile ? <GameList games={games} /> : <Thumbnails games={games} multiRow={true} />}
		</div>
	);
});

export default OrphanedExpansions;
