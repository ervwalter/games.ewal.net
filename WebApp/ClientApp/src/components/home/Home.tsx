import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";
import { Redirect, RouteComponentProps } from "react-router";

import StoresContext from "../../stores/StoresContext";
import { Tabs } from "../../stores/ViewStateStore";
import PlayedNotOwned from "./cleanup/PlayedNotOwned";
import PlayedNotRated from "./cleanup/PlayedNotRated";
import Collection from "./collection/Collection";
import Loading from "./core/Loading";
import TabStrip from "./core/TabStrip";
import styles from "./Home.module.scss";
import MostPlayed from "./mostplayed/MostPlayed";
import PreorderedGames from "./pending/PreorderedGames";
import UnplayedGames from "./pending/UnplayedGames";
import WantToBuyGames from "./pending/WantToBuyGames";
import RecentPlays from "./recent/RecentPlays";
import StatsBlock from "./stats/StatsBlock";
import TopTen from "./topten/TopTen";

interface MatchParams {
	section?: Tabs;
}

const Home: SFC<RouteComponentProps<MatchParams>> = observer(({match}) => {
	const { viewStateStore } = useContext(StoresContext);
	const { isMobile, activeSection } = viewStateStore;

	const section = match.params.section;
	 
	if (!isMobile && section === "stats") {
		return <Redirect to="/" />
	}

	if (section && activeSection !== section) {
		viewStateStore.changeSection(section);
	}
	else if (!section && activeSection !== "recentplays") {
		viewStateStore.changeSection("recentplays");
	}
	

	return (
		<>
			<div className={cx(styles["blurb"], "content")}>
				I freely admit that I am <i>obsessed</i> with modern/designer board games. I have a sizable collection
				of games, and I add to it more frequently than I should. I track the games that I own and the games that
				I play on <a href="https://boardgamegeek.com">BoardGameGeek</a>, and this page chronicles my addiction.
			</div>
			<StatsBlock visible={!isMobile} />
			<TabStrip />
			<RecentPlays count={25} visible={!section || section === "recentplays"} />
			<StatsBlock visible={isMobile && section === "stats"} />
			<MostPlayed visible={section === "mostplays"} />
			<TopTen visible={section === "topten"} />
			<PreorderedGames visible={ section === "comingsoon"} />
			<WantToBuyGames visible={ section === "comingsoon"} />
			<UnplayedGames visible={ section === "comingsoon"} />
			<Collection visible={ section === "collection"} />
			<PlayedNotRated visible={!isMobile && section === "cleanup"} />
			<PlayedNotOwned visible={!isMobile && section === "cleanup"} />
			<Loading />
		</>
	);
});

export default Home;
