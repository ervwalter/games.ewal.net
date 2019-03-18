import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import StoresContext from "../../../stores/StoresContext";
import styles from "./Rating.module.scss";

const Rating: SFC<{ rating?: number }> = React.memo(({ rating }) => {
	if (rating && rating > 0) {
		return (
			<>
				<span className="is-hidden-tablet">{rating}</span>
				<span className={cx(styles["stars"], "is-hidden-mobile")}>
					<span className={cx(styles["background"], "is-flex")}>
						<i className="far fa-star" />
						<i className="far fa-star" />
						<i className="far fa-star" />
						<i className="far fa-star" />
						<i className="far fa-star" />
						<i className="far fa-star" />
						<i className="far fa-star" />
						<i className="far fa-star" />
						<i className="far fa-star" />
						<i className="far fa-star" />
					</span>
					<span className={cx(styles["foreground"], "is-flex")} style={{ width: `${rating * 10}%` }}>
						<i className="fas fa-star" />
						<i className="fas fa-star" />
						<i className="fas fa-star" />
						<i className="fas fa-star" />
						<i className="fas fa-star" />
						<i className="fas fa-star" />
						<i className="fas fa-star" />
						<i className="fas fa-star" />
						<i className="fas fa-star" />
						<i className="fas fa-star" />
					</span>
				</span>
			</>
		);
	} else {
		return <span>—</span>;
	}
});

export default Rating;
