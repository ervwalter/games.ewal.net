import cx from "classnames";
import { analytics } from "common";
import { observer } from "mobx-react-lite";
import React, { SFC, useEffect } from "react";
import Helmet from "react-helmet";

import Loading from "../home/core/Loading";
import styles from "./Purge.module.scss";
import WantToTrade from "./WantToTrade";

const Purge: SFC = observer(() => {
	useEffect(() => {
		document.title = `To Be Pruned - Board Games`;
		analytics.track();
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
				I own too many games. I regularly prune my collection of games that just weren't for me or that I am unlikely to play again. The following is a
				list of the games currently need to find a good home (other than my house). If any of these look interesting to you and if you are willing to do
				a local pickup in the Madison, WI area, feel free to email me at <a href="mailto:erv@ewal.net">erv@ewal.net</a> or send a geek message on BGG to{" "}
				<a href="https://boardgamegeek.com/geekmail/compose?touser=ervwalter">ervwalter</a>.
			</div>
			<WantToTrade />
			<Loading />
		</>
	);
});

export default Purge;
