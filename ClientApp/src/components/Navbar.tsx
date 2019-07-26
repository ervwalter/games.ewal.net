import cx from "classnames";
import React, { SFC, useState } from "react";

import styles from "./Navbar.module.scss";

/* eslint jsx-a11y/anchor-is-valid: "off" */

const Navbar: SFC<{ showMenu: boolean }> = React.memo(({ showMenu }) => {
	const [menuOpen, setMenuOpen] = useState(false);

	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	const closeMenu = () => {
		setMenuOpen(false);
	};

	const scrollToSection = (section: string) => {
		closeMenu();
		const el = document.getElementById(section);
		if (el) {
			setImmediate(() => {
				el.scrollIntoView();
			});
		}
	};

	return (
		<nav className={cx("navbar", styles["masthead"])} id="masthead">
			<div className="container">
				<div className="navbar-brand">
					<div className="navbar-item">
						<div className={styles["logo"]}>
							<span className={styles["slashes"]}>{"// "}</span>
							<a href="https://www.ewal.net">Ewal.net</a>
						</div>
						<div className={cx(styles["description"], "is-hidden-mobile")}>
							Chronicles of a board game addict...
						</div>
					</div>
					<a
						role="button"
						className={cx("navbar-burger", "is-hidden-tablet", menuOpen && "is-active")}
						onClick={toggleMenu}
						aria-label="menu"
						aria-expanded="false">
						<span aria-hidden="true" />
						<span aria-hidden="true" />
						<span aria-hidden="true" />
					</a>
				</div>
				<div className={cx("navbar-menu", "is-hidden-tablet", menuOpen && "is-active")}>
					<div className="navbar-end">
						<a className="navbar-item" onClick={scrollToSection.bind(null, "recentPlays")}>
							Recent Plays
						</a>
						<a className="navbar-item" onClick={scrollToSection.bind(null, "mostPlays")}>
							Most Played
						</a>
						<a className="navbar-item" onClick={scrollToSection.bind(null, "top10")}>
							Top 10
						</a>
						<a className="navbar-item" onClick={scrollToSection.bind(null, "pending")}>
							Unplayed / Coming Soon
						</a>
						<a className="navbar-item" onClick={scrollToSection.bind(null, "collection")}>
							Collection
						</a>
					</div>
				</div>
			</div>
		</nav>
	);
});

export default Navbar;
