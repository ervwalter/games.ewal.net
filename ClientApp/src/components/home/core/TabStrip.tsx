import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { ReactNode, SFC, SyntheticEvent, useContext } from "react";

import StoresContext from "../../../stores/StoresContext";
import { Tabs } from "../../../stores/ViewStateStore";
import styles from "./TabStrip.module.scss";

const TabStrip: SFC = observer(() => {
	const { viewStateStore } = useContext(StoresContext);
	const isMobile = viewStateStore.isMobile;

	if (isMobile) {
		return null;
	}

	const activeTab = viewStateStore.activeTab;

	const handleTabChange = (tab: Tabs) => {
		viewStateStore.changeTab(tab);
	};

	return (
		<div className={cx("tabs", "is-boxed", "is-medium", styles["tab-strip"])}>
			<ul>
				<Tab tab="recentPlays" isActive={activeTab === "recentPlays"} onChange={handleTabChange}>
					Recent <span className="is-hidden-touch">&nbsp;Plays</span>
				</Tab>
				<Tab tab="mostPlays" isActive={activeTab === "mostPlays"} onChange={handleTabChange}>
					Most Played
				</Tab>
				<Tab tab="top10" isActive={activeTab === "top10"} onChange={handleTabChange}>
					Top 10
				</Tab>
				<Tab tab="collection" isActive={activeTab === "collection"} onChange={handleTabChange}>
					Collection
				</Tab>
				<Tab tab="pending" isActive={activeTab === "pending"} onChange={handleTabChange}>
					Unplayed<span className="is-hidden-touch">&nbsp;/ Preordered</span>
				</Tab>
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
	const handleTabChange = (tab: Tabs, e: SyntheticEvent) => {
		e.preventDefault();
		onChange(tab);
	};

	return (
		<li className={cx(isActive && "is-active")}>
			<a onClick={e => handleTabChange(tab, e)}>{children}</a>
		</li>
	);
};

export default TabStrip;
