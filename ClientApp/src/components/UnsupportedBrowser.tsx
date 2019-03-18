import "./UnsupportedBrowser.scss";

import React, { SFC } from "react";

const UnsupportedBrowser: SFC = () => {
	return (
		// <div id="outdated">
		// 	<h6>Your browser is out-of-date!</h6>
		// 	<p>
		// 		You will need to update your browser to view this website correctly.
		// 		<a id="btnUpdateBrowser" href="http://outdatedbrowser.com/">
		// 			Update your browser now
		// 		</a>
		// 	</p>
		// </div>
		<>
			{/* <h1 className="title">Uh Oh!</h1>
			<article className="message is-warning">
				<div className="message-body">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Pellentesque risus mi</strong>,
					tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam
					gravida purus diam, et dictum <a>felis venenatis</a> efficitur. Aenean ac <em>eleifend lacus</em>,
					in mollis lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor ligula, id
					porttitor mi magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
				</div>
			</article> */}

			<article className="message is-primary outdated">
				{/* <div className="message-header">
					<p>Uh Oh!</p>
				</div> */}
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
