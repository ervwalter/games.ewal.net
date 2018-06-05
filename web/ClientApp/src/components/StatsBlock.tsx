import { inject, observer } from "mobx-react";
import moment from "moment";
import numeral from "numeral";
import React from "react";
import { StatsStore } from "~/stores/StatsStore";

@inject("statsStore")
@observer
export default class StatsBlock extends React.Component<
  { statsStore?: StatsStore },
  {}
> {
  render() {
    const {
      collectionStats,
      thirtyDaysStats,
      thisYearStats,
      allTimeStats
    } = this.props.statsStore!;
    return (
      <div className="subsection stats">
        <div className="title is-4">Statistics</div>
        <div className="columns is-multiline is-mobile">
          <div className="column is-one-quarter-desktop is-half-tablet is-half-mobile">
            <small>COLLECTION</small>
            <br />
            <b>
              {collectionStats.numberOfGames}
            </b> games<span className="is-hidden-mobile"> owned</span>
            <br />
            <b>
              {collectionStats.numberOfExpansions}
            </b> expansions<span className="is-hidden-mobile"> owned</span>
            <br />
            <b>
              {collectionStats.numberOfPreviouslyOwned}
            </b> prev<span className="is-hidden-mobile">iously</span> owned<span className="is-hidden-mobile">
              {" "}
              games
            </span>
            <br />
            <b>{collectionStats.yetToBePlayed}</b>
            <span className="is-hidden-tablet"> unplayed</span>
            <span className="is-hidden-mobile"> games yet to be played</span>
            <br />
            <b>
              {collectionStats.preordered}
            </b> preorded<span className="is-hidden-mobile"> games</span>
            <br />
            <b>{collectionStats.top100Games}</b>
            <span className="is-hidden-mobile"> games from the BGG</span> top
            100
            <br />
            <b>
              {collectionStats.averageRating === "..."
                ? "..."
                : numeral(collectionStats.averageRating).format("0.0")}
            </b>
            <span className="is-hidden-tablet"> avg rating</span>
            <span className="is-hidden-mobile"> average rating</span>
            <br />
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet is-half-mobile">
            <small>PLAYS</small>
            <br />
            <b>{allTimeStats.numberOfPlays}</b> plays<br />
            <b>{allTimeStats.uniqueGames}</b> unique games<br />
            <b>
              {allTimeStats.hoursPlayed}
            </b> hours<span className="is-hidden-mobile"> played</span>
            <br />
            <b>
              {allTimeStats.quarters}
            </b> quarters<span className="is-hidden-mobile"> (25+ plays)</span>
            <br />
            <b>
              {allTimeStats.dimes}
            </b> dimes<span className="is-hidden-mobile"> (10+ plays)</span>
            <br />
            <b>
              {allTimeStats.nickles}
            </b> nickels<span className="is-hidden-mobile"> (5+ plays)</span>
            <br />
            <b>{allTimeStats.hIndex}</b> H-index<br />
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet is-half-mobile">
            <small>{moment().format("YYYY")} YEAR TO DATE</small>
            <br />
            <b>{thisYearStats.numberOfPlays}</b> plays<br />
            <b>{thisYearStats.uniqueGames}</b> unique games<br />
            <b>{thisYearStats.namedPlayers}</b> named players<br />
            <b>{thisYearStats.locations}</b> locations<br />
            <b>{thisYearStats.newGames}</b> new games<br />
            <b>
              {thisYearStats.hoursPlayed}
            </b> hours<span className="is-hidden-mobile"> played</span>
            <br />
          </div>
          <div className="column is-one-quarter-desktop is-half-tablet is-half-mobile">
            <small>LAST 30 DAYS</small>
            <br />
            <b>{thirtyDaysStats.numberOfPlays}</b> plays<br />
            <b>{thirtyDaysStats.uniqueGames}</b> unique games<br />
            <b>{thirtyDaysStats.namedPlayers}</b> named players<br />
            <b>{thirtyDaysStats.locations}</b> locations<br />
            <b>{thirtyDaysStats.newGames}</b> new games<br />
            <b>
              {thirtyDaysStats.hoursPlayed}
            </b> hours<span className="is-hidden-mobile"> played</span>
            <br />
          </div>
        </div>
      </div>
    );
  }
}
