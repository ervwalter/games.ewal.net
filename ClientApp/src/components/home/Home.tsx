import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, {  SFC, useContext } from "react";

import StoresContext from "../../stores/StoresContext";
import Collection from "./collection/Collection";
import Loading from "./core/Loading";
import TabStrip from "./core/TabStrip";
import styles from "./Home.module.scss";
import MostPlayed from "./mostplayed/MostPlayed";
import PreorderedGames from "./pending/PreorderedGames";
import WantToBuyGames from "./pending/WantToBuyGames";
import UnplayedGames from "./pending/UnplayedGames";
import RecentPlays from "./recent/RecentPlays";
import StatsBlock from "./stats/StatsBlock";
import TopTen from "./topten/TopTen";
import PlayedNotOwned from "./notowned/PlayedNotOwned";

const Home: SFC = observer(() => {
	const { viewStateStore } = useContext(StoresContext);
	const { isMobile, activeTab } = viewStateStore;
	return (
		<>
			<div className={cx(styles["blurb"], "content")}>
				I freely admit that I am <i>obsessed</i> with modern/designer board games. I have a sizable collection
				of games, and I add to it more frequently than I should. I track the games that I own and the games that
				I play on <a href="https://boardgamegeek.com">BoardGameGeek</a>, and this page chronicles my addiction.
			</div>
			<StatsBlock />
			<TabStrip />
			<RecentPlays count={isMobile ? 15 : 25} visible={isMobile || activeTab === "recentPlays"} />
			<MostPlayed visible={isMobile || activeTab === "mostPlays"} />
			<TopTen visible={isMobile || activeTab === "top10"} />
			<UnplayedGames visible={isMobile || activeTab === "pending"} />
			<PreorderedGames visible={isMobile || activeTab === "pending"} />
			<WantToBuyGames visible={isMobile || activeTab === "pending"} />
			<Collection visible={isMobile || activeTab === "collection"} />
			<PlayedNotOwned visible={!isMobile && activeTab === "playedNotOwned"} />
			<Loading />
			{/* <SectionTabs />
            <Loading /> */}
		</>
	);
});

export default Home;
