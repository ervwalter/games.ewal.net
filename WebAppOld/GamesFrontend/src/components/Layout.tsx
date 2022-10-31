import cx from "classnames";
import React, { ReactNode, SFC } from "react";

import styles from "./Layout.module.scss";
import Navbar from "./Navbar";

const Layout: SFC<{ children: ReactNode }> = ({ children }) => {
	return (
		<>
			<Navbar showMenu={true} />
			<section id="wrapper" className={cx(styles["wrapper"], styles["content"])}>
				<div className="container">{children}</div>
			</section>
		</>
	);
};

export default Layout;
