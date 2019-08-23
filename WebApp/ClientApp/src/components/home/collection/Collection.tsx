import { observer } from "mobx-react-lite";
import numeral from "numeral";
import React, { SFC, useContext } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router-dom";

import { SortColumns } from "../../../stores/CollectionStore";
import StoresContext from "../../../stores/StoresContext";
import styles from "./Collection.module.scss";
import CollectionTable from "./CollectionTable";

const Collection: SFC = observer(() => {
	const { collectionStore, statsStore } = useContext(StoresContext);
	const { collectionStats } = statsStore;

	if (collectionStore.isLoading) {
		return null;
	}

	const handleSort = (column: SortColumns) => {
		collectionStore.changeSort(column);
	};

	const description = `I have a sizable board game collection. My collection includes ${collectionStats.numberOfGames} games, ${
		collectionStats.numberOfExpansions
	} expansions, with an average rating of ${numeral(collectionStats.averageRating).format("0.0")}.`;

	const pruneCount = collectionStore.forTradeGames.length + 1;

	return (
		<>
			<Helmet>
				<meta name="description" content={description} />
			</Helmet>
			<div className={styles["collection"]} id="collection">
				<div className="title">
					<span className="is-hidden-mobile">Current </span>Game Collection
					<a className={styles["link"]} target="_blank" rel="noopener noreferrer" href="https://boardgamegeek.com/collection/user/ervwalter?own=1">
						<i className="fas fa-external-link-alt" />
					</a>
					<div className={styles["prune"]}>
						<div className={styles["stat"]}>
							<div>{pruneCount}</div> games to be pruned{" "}
							<Link to="/prune">
								<i className="fas fa-external-link-alt" />
							</Link>
						</div>
					</div>
				</div>
				<CollectionTable games={collectionStore.sortedGames} onSort={handleSort} />
			</div>
		</>
	);
});

export default Collection;
