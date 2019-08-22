import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { SFC, useEffect } from "react";
import Helmet from "react-helmet";

import analyticsTracker from "../../utils/Analytics";
import WantToTrade from "../home/cleanup/WantToTrade";
import Loading from "../home/core/Loading";
import styles from "./Purge.module.scss";

const Purge: SFC = observer(() => {
	useEffect(() => {
		document.title = `Chopping Block - Board Games`;
		analyticsTracker.track();
	}, []);

	const helmet = (
		<Helmet>
			<meta name="prerender-status-code" content="" />
			<meta name="prerender-header" content="" />
		</Helmet>
	);

	return (
		<>
			{helmet}
			<div className={cx(styles["blurb"], "content")}>
				I own too many games. I regularly prune my collection of games that just weren't for me and that I am unlikely to play again. The following is a
				list of the games currently on the chopping block.
			</div>
			<WantToTrade />
			<Loading />
		</>
	);
});

export default Purge;
