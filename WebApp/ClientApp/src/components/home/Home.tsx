import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent, SFC, useContext, useEffect } from "react";
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

interface ISection {
	components: FunctionComponent<any>[];
	title: string;
}

const sections: { [key: string]: ISection } = {
	stats: { components: [StatsBlock], title: "Statistics" },
	recentplays: { components: [RecentPlays], title: "Recent Plays" },
	collection: { components: [Collection], title: "Collection" },
	mostplays: { components: [MostPlayed], title: "Most Played" },
	topten: { components: [TopTen], title: "Top 10" },
	comingsoon: { components: [PreorderedGames, WantToBuyGames, UnplayedGames], title: "Coming Soon / Unplayed" },
	cleanup: { components: [PlayedNotRated, PlayedNotOwned], title: "Cleanup" }
};

const Home: SFC<RouteComponentProps<MatchParams>> = observer(({ match }) => {
	const { viewStateStore } = useContext(StoresContext);
	const { isMobile, activeSection } = viewStateStore;

	const section = match.params.section || "recentplays";
	const components = sections[section].components;
	const title = sections[section].title;

	useEffect(() => {
		document.title = `${title} - Board Games`;
	}, [title]);

	if (activeSection !== section) {
		viewStateStore.changeSection(section);
	}

	if (!isMobile && section === "stats") {
		return <Redirect to="/" />;
	}

	return (
		<>
			<div className={cx(styles["blurb"], "content")}>
				I freely admit that I am <i>obsessed</i> with modern/designer board games. I have a sizable collection of games, and I add to it more frequently
				than I should. I track the games that I own and the games that I play on <a href="https://boardgamegeek.com">BoardGameGeek</a>, and this page
				chronicles my addiction.
			</div>
			{!isMobile && <StatsBlock />}
			<TabStrip />
			{components.map((Component, index) => (
				<Component key={index} />
			))}
			<Loading />

			{/* <RecentPlays count={25} visible={!section || section === "recentplays"} />
			<StatsBlock visible={isMobile && section === "stats"} />
			<MostPlayed visible={section === "mostplays"} />
			<TopTen visible={section === "topten"} />
			<PreorderedGames visible={section === "comingsoon"} />
			<WantToBuyGames visible={section === "comingsoon"} />
			<UnplayedGames visible={section === "comingsoon"} />
			<Collection visible={section === "collection"} />
			<PlayedNotRated visible={!isMobile && section === "cleanup"} />
			<PlayedNotOwned visible={!isMobile && section === "cleanup"} /> */}
		</>
	);
});

export default Home;
