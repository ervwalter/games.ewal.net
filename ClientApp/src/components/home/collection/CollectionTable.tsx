import cx from "classnames";
import { observer } from "mobx-react-lite";
import React, { SFC, SyntheticEvent } from "react";

import { SortColumns } from "../../../stores/CollectionStore";
import { Game } from "../../../stores/Models";
import CollectionRow from "./CollectionRow";
import styles from "./CollectionTable.module.scss";

const CollectionTable: SFC<{ games: Game[]; onSort: (column: SortColumns) => void }> = React.memo(
	({ games, onSort }) => {
		const handleSort = (column: SortColumns, e: SyntheticEvent) => {
			e.preventDefault();
			onSort(column);
		};

		return (
			<div className={styles["collection-table"]}>
				<table className="table is-striped">
					<thead>
						<tr>
							<th>
								<a onClick={e => handleSort("sortableName", e)}>Name</a>
							</th>
							<th>
								<a onClick={e => handleSort("numPlays", e)}>
									<span className="is-hidden-mobile">Times </span>Played
								</a>
							</th>
							<th className="rating">
								<a onClick={e => handleSort("rating", e)}>
									<span className="is-hidden-mobile">My </span>Rating
								</a>
							</th>
						</tr>
					</thead>
					<tbody>
						{games.map(game => (
							<CollectionRow game={game} key={game.gameId} />
						))}
					</tbody>
				</table>
			</div>
		);
	}
);

export default CollectionTable;
