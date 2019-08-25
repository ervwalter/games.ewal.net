import arrayToSentence from "array-to-sentence";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";
import Helmet from "react-helmet";

import StoresContext from "../../../stores/StoresContext";
import styles from "./TopTen.module.scss";
import TopTenDesktop from "./TopTenDesktop";
import TopTenMobile from "./TopTenMobile";

const TopTen: SFC = observer(() => {
	const { topTenStore, viewStateStore } = useContext(StoresContext);
	if (topTenStore.games.length === 0) {
		return null;
	}

	const description = `These are my top 10 games.  At the top of the list are ${arrayToSentence(_.take(topTenStore.games, 3).map(g => g.name))}.`;
	return (
		<>
			<Helmet>
				<meta name="description" content={description} />
			</Helmet>
			<div className={styles["topten"]} id="topten">
				<div className="title">Top 10 Favorite Games</div>
				{viewStateStore.isMobile ? <TopTenMobile games={topTenStore.games} /> : <TopTenDesktop games={topTenStore.games} />}
			</div>
		</>
	);
});

export default TopTen;
