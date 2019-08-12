import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import StoresContext from "../../../stores/StoresContext";
import Thumbnails from "../core/Thumbnails";
import RecentPlayDetails from "./RecentPlayDetails";
import styles from "./RecentPlays.module.scss";

const RecentPlays: SFC<{ visible: boolean; count: number }> = observer(({ visible, count }) => {
	const { playStore } = useContext(StoresContext);

	if (!visible || playStore.isLoading) {
		return null;
	}

	const plays = _.take(playStore.plays, count);

	return (
		<div className={styles["recent"]} id="recentplays">
			<div className="title">
				Recent Plays
				<a
					className={styles["link"]}
					target="_blank" rel="noopener noreferrer"
					href="https://boardgamegeek.com/plays/bydate/user/ervwalter/subtype/boardgame">
					<i className="fas fa-external-link-alt" />
				</a>
			</div>
			<Thumbnails games={playStore.recentThumbnails} />
			<RecentPlayDetails plays={plays} />
			{/* <PlaysTableOrList plays={_.take(this.props.playStore!.plays, count)} /> */}
		</div>
	);
});

export default RecentPlays;
