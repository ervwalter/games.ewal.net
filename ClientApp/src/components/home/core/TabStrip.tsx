import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { ReactNode, SFC, useContext } from "react";
import { Link } from "react-router-dom";

import StoresContext from "../../../stores/StoresContext";
import { Tabs } from "../../../stores/ViewStateStore";
import styles from "./TabStrip.module.scss";

/* eslint jsx-a11y/anchor-is-valid: "off" */

const TabStrip: SFC = observer(() => {
	const { viewStateStore } = useContext(StoresContext);
	const isMobile = viewStateStore.isMobile;
	const showPlayedNotOwned = viewStateStore.showPlayedNotOwned;

	if (isMobile) {
		return null;
	}

	const activeSection = viewStateStore.activeSection;

	const handleTabChange = (tab: Tabs) => {
		viewStateStore.changeSection(tab);
	};

	return (
		<div className={cx("tabs", "is-boxed", "is-medium", styles["tab-strip"])}>
			<ul>
				<Tab tab="recentplays" isActive={activeSection === "recentplays"} onChange={handleTabChange}>
					Recent <span className="is-hidden-touch">&nbsp;Plays</span>
				</Tab>
				<Tab tab="mostplays" isActive={activeSection === "mostplays"} onChange={handleTabChange}>
					Most Played
				</Tab>
				<Tab tab="topten" isActive={activeSection === "topten"} onChange={handleTabChange}>
					Top 10
				</Tab>
				<Tab tab="collection" isActive={activeSection === "collection"} onChange={handleTabChange}>
					Collection
				</Tab>
				<Tab tab="comingsoon" isActive={activeSection === "comingsoon"} onChange={handleTabChange}>
					Coming Soon<span className="is-hidden-touch">&nbsp;/ Unplayed</span>
				</Tab>
				{showPlayedNotOwned &&
					<Tab tab="cleanup" isActive={activeSection === "cleanup"} onChange={handleTabChange}>
						Cleanup
					</Tab>
				}
			</ul>
		</div>
	);
});

const Tab: SFC<{ tab: Tabs; isActive: boolean; onChange: (tab: Tabs) => void; children: ReactNode }> = ({
	tab,
	isActive,
	onChange,
	children
}) => {

	return (
		<li className={cx(isActive && "is-active")}>
			<Link to={`/${tab}`} >{children}</Link>
		</li>
	);
};

export default TabStrip;
