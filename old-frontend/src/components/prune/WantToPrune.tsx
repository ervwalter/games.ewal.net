import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { SFC, useContext, useEffect } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";
import { analytics } from "spa-analytics-wrapper";

import { Game } from "../../stores/Models";
import StoresContext from "../../stores/StoresContext";
import GameList from "../home/core/GameList";
import Loading from "../home/core/Loading";
import Thumbnails from "../home/core/Thumbnails";
import styles from "./WantToPrune.module.scss";

const WantToPrune: SFC = observer(() => {
	const { collectionStore, viewStateStore } = useContext(StoresContext);
	useEffect(() => {
		document.title = `To Be Pruned - Board Games`;
		analytics.track();
	}, []);

	const helmet = (
		<Helmet>
			<meta name="prerender-status-code" content="" />
			<meta name="prerender-header" content="" />
		</Helmet>
	);

	const games: Game[] = collectionStore.forTradeGames;

	if (collectionStore.isLoading) {
		return null;
	}

	if (games.length === 0) {
		return (
			<>
				{helmet}
				<div className={cx(styles["blurb"], "content")}>
					Sorry, but all of the games I was looking to prune from my collection have been claimed. However, from time to time I look at the games in
					my collection that are not likely to get played again, and I add more games to this list, so feel free to check back later.
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
			{helmet}
			<div className={cx(styles["blurb"], "content")}>
				I own too many games. I regularly prune my collection of games that just weren't for me or that I am unlikely to play again. The following is a
				list of the games currently need to find a good home (other than my house). If any of these look interesting to you and if you are willing to do
				a local pickup in the Madison, WI area, feel free to email me at <a href="mailto:erv@ewal.net">erv@ewal.net</a> or send a geek message on BGG to{" "}
				<a href="https://boardgamegeek.com/geekmail/compose?touser=ervwalter">ervwalter</a>.
			</div>

			<div className={styles["wanttotrade"]} id="wanttotrade">
				<div className="title">Games to be Pruned</div>
				{viewStateStore.isMobile ? <GameList games={games} /> : <Thumbnails games={games} multiRow={true} />}
			</div>
			<Loading />

			<div className={styles["backlink"]}>
				<Link to="/collection">
					<i className="fas fa-chevron-left" /> Back to Collection
				</Link>
			</div>
		</>
	);
});

export default WantToPrune;
