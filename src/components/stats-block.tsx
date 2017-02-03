import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { StatsStore } from '../stores/stats-store';

@inject("statsStore")
@observer
export default class StatsBlock extends React.Component<{ statsStore?: StatsStore }, {}> {
	render() {
		let store = this.props.statsStore;
		return (
			<div className="subsection stats">
				<div className="title is-4">Statistics</div>
				<div className="columns">
					<div className="column">
						<small>LAST 30 DAYS</small><br />
						<b>{store.thirtyDaysStats.numberOfPlays}</b> plays<br />
						<b>{store.thirtyDaysStats.uniqueGames}</b> unique games<br />
						<b>{store.thirtyDaysStats.namedPlayers}</b> named players<br />
						<b>{store.thirtyDaysStats.locations}</b> locations<br />
						<b>{store.thirtyDaysStats.newGames}</b> new games<br />
						<b>{store.thirtyDaysStats.hoursPlayed}</b> hours played<br />
					</div>
					<div className="column">
						<small>ALL TIME</small><br />
						<b>{store.allTimeStats.numberOfPlays}</b> plays<br />
						<b>{store.allTimeStats.uniqueGames}</b> unique games<br />
						<b>{store.allTimeStats.namedPlayers}</b> named players<br />
						<b>{store.allTimeStats.locations}</b> locations<br />
						<b>{store.allTimeStats.hoursPlayed}</b> hours played<br />
					</div>
					<div className="column">
						<small>COLLECTION</small><br />
						<b>{store.collectionStats.numberOfGames}</b> games owned<br />
						<b>{store.collectionStats.numberOfExpansions}</b> expansions owned<br />
						<b>{store.collectionStats.yetToBePlayed}</b> games yet to be played<br />
						<b>{store.collectionStats.dimes}</b> dimes (10+ plays)<br />
						<b>{store.collectionStats.nickles}</b> nickels (5+ plays)<br />
						<b>{store.collectionStats.hIndex}</b> H-index<br />
					</div>
				</div>
			</div>
		);
	}
}
