import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { FunctionComponent, SFC, useContext, useEffect } from "react";
import Helmet from "react-helmet";
import { RouteComponentProps } from "react-router";
import { analytics } from "spa-analytics-wrapper";

import StoresContext from "../../stores/StoresContext";
import { Tabs } from "../../stores/ViewStateStore";
import Cleanup from "./cleanup/Cleanup";
import Collection from "./collection/Collection";
import Loading from "./core/Loading";
import RedirectWithPrerender from "./core/RedirectWithPrerender";
import TabStrip from "./core/TabStrip";
import styles from "./Home.module.scss";
import MostPlayed from "./mostplayed/MostPlayed";
import ComingSoon from "./pending/ComingSoon";
import RecentPlays from "./recent/RecentPlays";
import StatsBlock from "./stats/StatsBlock";
import TopTen from "./topten/TopTen";

interface MatchParams {
	section?: Tabs;
}

interface ISection {
	component: FunctionComponent<any>;
	title: string;
}

const sections: { [key: string]: ISection } = {
	stats: { component: StatsBlock, title: "Statistics" },
	recentplays: { component: RecentPlays, title: "Recent Plays" },
	collection: { component: Collection, title: "Collection" },
	mostplays: { component: MostPlayed, title: "Most Played" },
	topten: { component: TopTen, title: "Top 10" },
	comingsoon: { component: ComingSoon, title: "Coming Soon / Unplayed" },
	other: { component: Cleanup, title: "Other" }
};

const Home: SFC<RouteComponentProps<MatchParams>> = observer(({ location, match }) => {
	const { viewStateStore } = useContext(StoresContext);
	const { activeSection } = viewStateStore;

	const section = match.params.section || "stats";
	const sectionDetails: ISection | undefined = sections[section];
	const title = sectionDetails ? sectionDetails.title : "";

	if (section === "other") {
		viewStateStore.setShowPlayedNotOwned(true);
	}

	useEffect(() => {
		document.title = `${title} - Board Games`;
		window.scrollTo(0, 0);
		analytics.track();
	}, [title]);

	if (!sectionDetails) {
		return <RedirectWithPrerender to="/" />;
	}

	const Component = sectionDetails.component;

	if (activeSection !== section) {
		viewStateStore.changeSection(section);
	}

	if (!viewStateStore.showPlayedNotOwned && section === "other") {
		return <RedirectWithPrerender to="/" />;
	}

	let helmet;
	if (location.state && location.state.isRedirect) {
		helmet = (
			<Helmet>
				<meta name="prerender-status-code" content="301" />
				<meta name="prerender-header" content={`Location: ${window.location.origin}${location.state.redirectLocation}`} />
			</Helmet>
		);
	} else {
		helmet = (
			<Helmet>
				<meta name="prerender-status-code" content="" />
				<meta name="prerender-header" content="" />
			</Helmet>
		);
	}

	return (
		<>
			{helmet}
			<div className={cx(styles["blurb"], "content")}>
				I freely admit that I am <i>obsessed</i> with modern/designer board games. I have a sizable collection of games, and I add to it more frequently
				than I should. I track the games that I own and the games that I play on <a href="https://boardgamegeek.com">BoardGameGeek</a>, and this page
				chronicles my addiction.
			</div>
			{/* {!isMobile && <StatsBlock />} */}
			<TabStrip />
			<Component />
			<Loading />
		</>
	);
});

export default Home;
