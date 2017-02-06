import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { StatsStore } from '../stores/stats-store';
import * as moment from 'moment';

@inject("statsStore")
@observer
export default class StatsBlock extends React.Component<{ statsStore?: StatsStore }, {}> {
	render() {
		let store = this.props.statsStore;
		return (
			<div className="subsection stats">
				<div className="title is-4">Statistics</div>
				<div className="columns is-multiline is-mobile">
					<div className="column is-one-quarter-desktop is-half-tablet is-half-mobile">
						<small>COLLECTION</small><br />
						<b>{store.collectionStats.numberOfGames}</b> games<span className="is-hidden-mobile"> owned</span><br />
						<b>{store.collectionStats.numberOfExpansions}</b> expansions<span className="is-hidden-mobile"> owned</span><br />
						<b>{store.collectionStats.yetToBePlayed}</b><span className="is-hidden-tablet"> unplayed</span><span className="is-hidden-mobile"> games yet to be played</span><br />
						<b>{store.collectionStats.dimes}</b> dimes<span className="is-hidden-mobile"> (10+ plays)</span><br />
						<b>{store.collectionStats.nickles}</b> nickels<span className="is-hidden-mobile"> (5+ plays)</span><br />
						<b>{store.collectionStats.hIndex}</b> H-index<br />
					</div>
					<div className="column is-one-quarter-desktop is-half-tablet is-half-mobile">
						<small>LAST 30 DAYS</small><br />
						<b>{store.thirtyDaysStats.numberOfPlays}</b> plays<br />
						<b>{store.thirtyDaysStats.uniqueGames}</b> unique games<br />
						<b>{store.thirtyDaysStats.namedPlayers}</b> named players<br />
						<b>{store.thirtyDaysStats.locations}</b> locations<br />
						<b>{store.thirtyDaysStats.newGames}</b> new games<br />
						<b>{store.thirtyDaysStats.hoursPlayed}</b> hours<span className="is-hidden-mobile"> played</span><br />
					</div>
					<div className="column is-one-quarter-desktop is-half-tablet is-half-mobile">
						<small>{moment().format('YYYY')} YEAR TO DATE</small><br />
						<b>{store.thisYearStats.numberOfPlays}</b> plays<br />
						<b>{store.thisYearStats.uniqueGames}</b> unique games<br />
						<b>{store.thisYearStats.namedPlayers}</b> named players<br />
						<b>{store.thisYearStats.locations}</b> locations<br />
						<b>{store.thisYearStats.newGames}</b> new games<br />
						<b>{store.thisYearStats.hoursPlayed}</b> hours<span className="is-hidden-mobile"> played</span><br />
					</div>
					<div className="column is-one-quarter-desktop is-half-tablet is-half-mobile">
						<small>ALL TIME</small><br />
						<b>{store.allTimeStats.numberOfPlays}</b> plays<br />
						<b>{store.allTimeStats.uniqueGames}</b> unique games<br />
						<b>{store.allTimeStats.namedPlayers}</b> named players<br />
						<b>{store.allTimeStats.locations}</b> locations<br />
						<b>{store.allTimeStats.hoursPlayed}</b> hours<span className="is-hidden-mobile"> played</span><br />
					</div>
				</div>
			</div>
		);
	}
}
