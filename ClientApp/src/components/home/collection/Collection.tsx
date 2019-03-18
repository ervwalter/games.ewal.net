import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import { SortColumns } from "../../../stores/CollectionStore";
import StoresContext from "../../../stores/StoresContext";
import BackToTop from "../core/BackToTop";
import styles from "./Collection.module.scss";
import CollectionTable from "./CollectionTable";

const Collection: SFC<{ visible: boolean }> = observer(({ visible }) => {
	if (!visible) {
		return null;
	}

	const { collectionStore } = useContext(StoresContext);

	const handleSort = (column: SortColumns) => {
		collectionStore.changeSort(column);
	};

	return (
		<div className={styles["collection"]} id="collection">
			<div className="title is-4">
				<BackToTop />
				<span className="is-hidden-mobile">Current </span>Game Collection
				<a
					className={styles["link"]}
					target="_blank"
					href="https://boardgamegeek.com/collection/user/ervwalter?own=1">
					<i className="fas fa-external-link-alt" />
				</a>
			</div>
			<CollectionTable games={collectionStore.sortedGames} onSort={handleSort} />
		</div>
	);
});

export default Collection;
