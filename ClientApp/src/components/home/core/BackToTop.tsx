import cx from "classnames";
import React, { SFC } from "react";
import { Link } from "react-router-dom";

import styles from "./BackToTop.module.scss";

/* eslint jsx-a11y/anchor-is-valid: "off" */

const BackToTop: SFC = React.memo(() => {
	return (
		<Link to="/" className={cx(styles["top-link"], "is-hidden-tablet")}>
			<i className="fal fa-arrow-to-top" />
		</Link>
	);
});

export default BackToTop;
