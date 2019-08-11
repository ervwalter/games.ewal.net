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

	return (
		<div className={cx("tabs", "is-boxed", "is-medium", styles["tab-strip"])}>
			<ul>
				<Tab isActive={activeSection === "recentplays"} >
					Recent <span className="is-hidden-touch">&nbsp;Plays</span>
				</Tab>
				<Tab tab="mostplays" isActive={activeSection === "mostplays"} >
					Most Played
				</Tab>
				<Tab tab="topten" isActive={activeSection === "topten"} >
					Top 10
				</Tab>
				<Tab tab="collection" isActive={activeSection === "collection"} >
					Collection
				</Tab>
				<Tab tab="comingsoon" isActive={activeSection === "comingsoon"} >
					Coming Soon<span className="is-hidden-touch">&nbsp;/ Unplayed</span>
				</Tab>
				{showPlayedNotOwned &&
					<Tab tab="cleanup" isActive={activeSection === "cleanup"} >
						Cleanup
					</Tab>
				}
			</ul>
		</div>
	);
});

const Tab: SFC<{ tab?: Tabs; isActive: boolean; children: ReactNode }> = ({
	tab,
	isActive,
	children
}) => {

	return (
		<li className={cx(isActive && "is-active")}>
			<Link to={`/${tab || ""}`} >{children}</Link>
		</li>
	);
};

export default TabStrip;
