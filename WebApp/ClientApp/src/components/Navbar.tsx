import cx from "classnames";
import React, { SFC } from "react";

import styles from "./Navbar.module.scss";

/* eslint jsx-a11y/anchor-is-valid: "off" */

const Navbar: SFC<{ showMenu: boolean }> = React.memo(({ showMenu }) => {
	return (
		<nav className={cx("navbar", styles["masthead"])} id="masthead">
			<div className="container">
				<div className="navbar-brand">
					<div className="navbar-item">
						<div className={styles["logo"]}>
							<span className={styles["slashes"]}>{"// "}</span>
							<a href="https://www.ewal.net">Ewal.net</a>
						</div>
						<div className={cx(styles["description"], "is-hidden-mobile")}>Chronicles of a board game addict...</div>
					</div>
				</div>
			</div>
		</nav>
	);
});

export default Navbar;
