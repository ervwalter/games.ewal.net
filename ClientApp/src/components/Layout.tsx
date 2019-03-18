import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { Component, ReactNode, SFC, useContext } from "react";

import StoresContext from "../stores/StoresContext";
import styles from "./Layout.module.scss";

const Layout: SFC<{ children: ReactNode }> = observer(({ children }) => {
	const { viewStateStore } = useContext(StoresContext);
	const { menuOpen } = viewStateStore;

	const toggleMenu = () => {
		viewStateStore.toggleMenu();
	};

	const closeMenu = () => {
		viewStateStore.closeMenu();
	};

	const scrollToSection = (section: string) => {
		const el = document.getElementById(section);
		if (el) {
			el.scrollIntoView();
		}
		closeMenu();
	};

	return (
		<>
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
								Unplayed / Preordered
							</a>
							<a className="navbar-item" onClick={scrollToSection.bind(null, "collection")}>
								Collection
							</a>
						</div>
					</div>
				</div>
			</nav>
			<section className={cx(styles["wrapper"], styles["content"])}>
				<div className="container">{children}</div>
			</section>
		</>
	);
});

export default Layout;
