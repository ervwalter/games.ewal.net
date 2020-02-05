import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { ReactNode, SFC, useContext } from "react";
import { Link } from "react-router-dom";
import { ReactSVG } from "react-svg";

import collectionIcon from "../../../images/collection.svg";
import comingSoonIcon from "../../../images/coming-soon.svg";
import mostPlayedIcon from "../../../images/most-played.svg";
import recentIcon from "../../../images/recent.svg";
import statsIcon from "../../../images/stats.svg";
import topTenIcon from "../../../images/top-ten.svg";
import StoresContext from "../../../stores/StoresContext";
import { Tabs } from "../../../stores/ViewStateStore";
import styles from "./TabStrip.module.scss";

/* eslint jsx-a11y/anchor-is-valid: "off" */

const TabStrip: SFC = observer(() => {
	const { viewStateStore } = useContext(StoresContext);
	const showPlayedNotOwned = viewStateStore.showPlayedNotOwned;

	return (
		<div className={cx("tabs", "is-medium", styles["tab-strip"])}>
			<ul>
				<Tab tab="stats" path="/" icon={statsIcon} label="Stats" />
				<Tab
					tab="recentplays"
					icon={recentIcon}
					label={
						<>
							Recent <span className="is-hidden-touch">&nbsp;Plays</span>
						</>
					}
				/>
				<Tab tab="mostplays" icon={mostPlayedIcon} label="Most Played" />
				<Tab tab="topten" icon={topTenIcon} label="Top 10" />
				<Tab tab="collection" icon={collectionIcon} label="Collection" />
				<Tab
					tab="comingsoon"
					icon={comingSoonIcon}
					label={
						<>
							Coming Soon<span className="is-hidden-touch">&nbsp;/ Unplayed</span>
						</>
					}
				/>
				{showPlayedNotOwned && <Tab tab="other" icon={recentIcon} label="Other" />}
			</ul>
		</div>
	);
});

const Tab: SFC<{ tab?: Tabs; icon: string; label: ReactNode; path?: string }> = observer(({ tab, icon, label, path }) => {
	const { viewStateStore } = useContext(StoresContext);
	const { activeSection } = viewStateStore;

	path = path || `/${tab}`;

	return (
		<li className={cx(activeSection === tab && "is-active")}>
			<Link to={path}>
				<ReactSVG src={icon} className={cx("is-mobile-only", styles[`tab-${tab}`])} />
				<span className="is-hidden-mobile">{label}</span>
			</Link>
		</li>
	);
});

export default TabStrip;
