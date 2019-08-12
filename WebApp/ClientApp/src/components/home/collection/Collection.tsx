import { observer } from "mobx-react-lite";
import React, { SFC, useContext } from "react";

import { SortColumns } from "../../../stores/CollectionStore";
import StoresContext from "../../../stores/StoresContext";
import styles from "./Collection.module.scss";
import CollectionTable from "./CollectionTable";

const Collection: SFC<{ visible: boolean }> = observer(({ visible }) => {
	const { collectionStore } = useContext(StoresContext);
	if (!visible) {
		return null;
	}

	const handleSort = (column: SortColumns) => {
		collectionStore.changeSort(column);
	};

	return (
		<div className={styles["collection"]} id="collection">
			<div className="title">
				<span className="is-hidden-mobile">Current </span>Game Collection
				<a
					className={styles["link"]}
					target="_blank" rel="noopener noreferrer"
					href="https://boardgamegeek.com/collection/user/ervwalter?own=1">
					<i className="fas fa-external-link-alt" />
				</a>
			</div>
			<CollectionTable games={collectionStore.sortedGames} onSort={handleSort} />
		</div>
	);
});

export default Collection;
