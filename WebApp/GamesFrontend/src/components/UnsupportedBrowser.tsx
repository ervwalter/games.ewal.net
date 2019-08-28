import "./UnsupportedBrowser.scss";

import { analytics } from "common";
import React, { SFC } from "react";

const UnsupportedBrowser: SFC = () => {
	window.document.title = "Unsupported Browser - Board Games";
	analytics.track();

	return (
		<>
			<article className="message is-primary outdated">
				<div className="message-body">
					<h6>Your browser is out-of-date!</h6>
					<p>You will need to update your browser to view this website correctly.</p>
					<p>
						<a className="button is-primary" href="http://outdatedbrowser.com/">
							Update your browser now
						</a>
					</p>
				</div>
			</article>
		</>
	);
};

export default UnsupportedBrowser;
