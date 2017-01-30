import * as React from 'react';
import {observer, inject} from 'mobx-react';
import {StatsStore} from '../stores/stats-store';

@inject("statsStore")
@observer
export default class StatsBlock extends React.Component<{statsStore?: StatsStore},{}> {
  render() {
    console.log('StatBlock rendering');
    return (
      <div>
        <div className="title is-4">Statistics</div>
        <div className="columns">
          <div className="column">
            <small>LAST 30 DAYS</small><br/>
            <b>{this.props.statsStore.thirtyDays.numberOfPlays}</b> plays<br />
            <b>100</b> unique games<br />
            <b>6</b> named players<br />
            <b>3</b> locations<br />
            <b>13</b> new games<br />
            <b>≈14</b> hours played<br />
          </div>
          <div className="column">
            <small>ALL TIME</small><br />
            <b>{this.props.statsStore.allTime.numberOfPlays}</b> plays<br />
            <b>...</b> unique games<br />
            <b>6</b> named players<br />
            <b>3</b> locations<br />
            <b>≈362</b> hours played<br />
          </div>
          <div className="column">
            <small>COLLECTION</small><br />
            <b>{this.props.statsStore.collection.numberOfGames}</b> games owned<br />
            <b>133</b> expansions owned<br />
            <b>14</b> games yet to be played<br />
            <b>12</b> H-index<br />
            <small>(12 games were played at least 12 times)</small>
          </div>
        </div>
      </div>
    );
  }
}
