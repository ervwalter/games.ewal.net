import React, { SFC } from "react";
import { Redirect } from "react-router";

const RedirectWithPrerender: SFC<{ to: string }> = ({ to }) => {
	return (
		<>
			<Redirect to={{
				pathname: to,
				state: {
					isRedirect: true,
					redirectLocation: to
				}
			}}
			/>)
		</>
	);
}

export default RedirectWithPrerender;
