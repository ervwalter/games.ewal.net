import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";
import { Link } from "react-router-dom";

import StoresContext from "../../../stores/StoresContext";
import GameList from "../core/GameList";
import Thumbnails from "../core/Thumbnails";
import styles from "./WantToTrade.module.scss";

const WantToTrade: SFC = observer(() => {
	const { collectionStore, viewStateStore } = useContext(StoresContext);
	const games = collectionStore.forTradeGames;
	if (games.length === 0) {
		return null;
	}
	return (
		<>
			<div className={styles["notrated"]} id="notrated">
				<div className="title">Games to be Pruned</div>
				{viewStateStore.isMobile ? <GameList games={games} /> : <Thumbnails games={games} multiRow={true} />}
			</div>
			<div>
				<Link to="/collection">
					<i className="fas fa-chevron-left" /> Back to Collection
				</Link>
			</div>
		</>
	);
});

export default WantToTrade;
