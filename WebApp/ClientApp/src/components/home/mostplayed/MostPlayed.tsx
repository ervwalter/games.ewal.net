import arrayToSentence from "array-to-sentence";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";
import Helmet from "react-helmet";

import StoresContext from "../../../stores/StoresContext";
import Legend from "./Legend";
import styles from "./MostPlayed.module.scss";
import PlayedGamesTable from "./PlayedGamesTable";

const MostPlayed: SFC = observer(() => {
	const { playStore, statsStore } = useContext(StoresContext);
	const { allTimeStats } = statsStore;

	const games = _.chain(playStore.playedGames)
		.filter(g => g.numPlays! >= 5)
		.value();
	const mostPlayed = _.chain(games)
		.take(5)
		.value()
		.map(g => g.name);
	const description = `I play some games a lot, and others only once or twice. My most played games include ${arrayToSentence(mostPlayed)}. I have played ${
		allTimeStats.quarters
	} games at least 25 times each, and ${allTimeStats.dimes} games at least 10 time each.`;

	return (
		<>
			<Helmet>
				<meta name="description" content={description} />
			</Helmet>
			<div className={styles["most-played"]} id="mostplays">
				<div className="title">
					Most Played Games <Legend stats={statsStore.allTimeStats} />
				</div>
				<PlayedGamesTable games={games} />
			</div>
		</>
	);
});

export default MostPlayed;
