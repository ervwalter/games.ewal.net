import arrayToSentence from "array-to-sentence";
import _ from "lodash";
import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";
import Helmet from "react-helmet";

import StoresContext from "../../../stores/StoresContext";
import Thumbnails from "../core/Thumbnails";
import RecentPlayDetails from "./RecentPlayDetails";
import styles from "./RecentPlays.module.scss";

const RecentPlays: SFC = observer(() => {
	const { playStore } = useContext(StoresContext);
	const count = 25;
	if (playStore.isLoading) {
		return null;
	}

	const plays = _.take(playStore.plays, count);
	const recentThumbnails = playStore.recentThumbnails;
	const description = `I play board games pretty regularly.  Most recently I have played ${arrayToSentence(_.take(recentThumbnails, 5).map(g => g.name))}.`;

	return (
		<>
			<Helmet>
				<meta name="description" content={description} />
			</Helmet>
			<div className={styles["recent"]} id="recentplays">
				<div className="title">
					Recent Plays
					<a
						className={styles["link"]}
						target="_blank"
						rel="noopener noreferrer"
						href="https://boardgamegeek.com/plays/bydate/user/ervwalter/subtype/boardgame">
						<i className="fas fa-external-link-alt" />
					</a>
				</div>
				<Thumbnails games={recentThumbnails} />
				<RecentPlayDetails plays={plays} />
				{/* <PlaysTableOrList plays={_.take(this.props.playStore!.plays, count)} /> */}
			</div>
		</>
	);
});

export default RecentPlays;
