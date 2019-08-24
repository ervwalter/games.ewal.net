import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";
import { Link } from "react-router-dom";

import StoresContext from "../../stores/StoresContext";
import GameList from "../home/core/GameList";
import Loading from "../home/core/Loading";
import Thumbnails from "../home/core/Thumbnails";
import styles from "./WantToTrade.module.scss";

const WantToTrade: SFC = observer(() => {
	const { collectionStore, viewStateStore } = useContext(StoresContext);
	const games = collectionStore.forTradeGames;

	if (collectionStore.isLoading) {
		return null;
	}

	if (games.length === 0) {
		return (
			<>
				<div>
					<div className="title">Games to be Pruned</div>
					<p>
						Sorry, but I have not identified any games I am looking to prune from my collection at this time. However, this list gets updated from
						time to time as I look at the games in my collection that are not likely to get played again, so feel free to check back later.
					</p>
				</div>
				<div className={styles["backlink"]}>
					<Link to="/collection">
						<i className="fas fa-chevron-left" /> Back to Collection
					</Link>
				</div>
			</>
		);
	}
	return (
		<>
			<div className={styles["notrated"]} id="wanttotrade">
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
