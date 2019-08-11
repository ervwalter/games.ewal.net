import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { SFC, useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router";

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
	const { viewStateStore, collectionStore, playStore, topTenStore } = useContext(StoresContext);
	const { isMobile, activeSection } = viewStateStore;

	const isLoading = collectionStore.isLoading || playStore.isLoading || topTenStore.isLoading;
	const section = match.params.section;
	
	if (section && activeSection !== section) {
		viewStateStore.changeSection(section);
	}
	
	useEffect(() => {
		if (isMobile && !isLoading) {
			const target:string = section || "masthead";
			const el = document.getElementById(target);
			if (el) {
				setImmediate(() => {
					el.scrollIntoView();
				});
			}
		}
	},[isMobile, section, isLoading]);

	if (isLoading && isMobile && section) {
		return <Loading />;
	}
	
	return (
		<>
			<div className={cx(styles["blurb"], "content")}>
				I freely admit that I am <i>obsessed</i> with modern/designer board games. I have a sizable collection
				of games, and I add to it more frequently than I should. I track the games that I own and the games that
				I play on <a href="https://boardgamegeek.com">BoardGameGeek</a>, and this page chronicles my addiction.
			</div>
			<StatsBlock />
			<TabStrip />
			<RecentPlays count={isMobile ? 15 : 25} visible={isMobile ||!section || section === "recentplays"} />
			<MostPlayed visible={isMobile || section === "mostplays"} />
			<TopTen visible={isMobile || section === "topten"} />
			<PreorderedGames visible={isMobile || section === "comingsoon"} />
			<WantToBuyGames visible={isMobile || section === "comingsoon"} />
			<UnplayedGames visible={isMobile || section === "comingsoon"} />
			<Collection visible={isMobile || section === "collection"} />
			<PlayedNotRated visible={!isMobile && section === "cleanup"} />
			<PlayedNotOwned visible={!isMobile && section === "cleanup"} />
			<Loading />
		</>
	);
});

export default Home;
