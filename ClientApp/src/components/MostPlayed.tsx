import classNames from "classnames";
import _ from "lodash";
import { inject, observer } from "mobx-react";
import numeral from "numeral";
import React, { SFC } from "react";
import { PlayStore, PlayedGame } from "~/stores/PlayStore";
import { PlayStats, StatsStore } from "~/stores/StatsStore";

@inject("playStore", "statsStore")
@observer
export default class MostPlayed extends React.Component<{
  playStore?: PlayStore;
  statsStore?: StatsStore;
  visible: boolean;
}> {
  render() {
    const playStore = this.props.playStore!;
    const statsStore = this.props.statsStore!;
    let className = "subsection";
    if (!this.props.visible) {
      className += " hidden";
    }
    return (
      <div className={className}>
        <div className="title is-4">
          Most Played Games <Legend stats={statsStore.allTimeStats} />
        </div>

        <PlayedGamesTable games={playStore.playedGames} />
      </div>
    );
  }
}

const Legend: SFC<{ stats: PlayStats }> = ({ stats }) => (
  <div className="most-plays-legend">
    <div className="stat">
      <div className="nickels">{stats.nickles}</div> nickels
    </div>
    <div className="stat">
      <div className="dimes">{stats.dimes}</div> dimes
    </div>
    <div className="stat">
      <div className="quarters">{stats.quarters}</div> quarters
    </div>
  </div>
);

class PlayedGamesTable extends React.Component<{ games: PlayedGame[] }> {
  render() {
    const games = _.filter(this.props.games, g => g.numPlays! >= 5);
    return (
      <div className="most-plays">
        <table className="table">
          <thead>
            <tr>
              <th className="rank">#</th>
              <th>Name</th>
              <th>
                <span className="is-hidden-mobile">Times </span>Played
              </th>
              <th className="duration">
                Hours<span className="is-hidden-mobile"> Played</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, index) => (
              <PlayedGameRow game={game} rank={index} key={game.gameId} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

const PlayedGameRow: SFC<{ game: PlayedGame; rank: number }> = ({
  game,
  rank
}) => {
  const numPlays = game.numPlays!;
  return (
    <tr
      className={classNames({
        quarter: numPlays >= 25,
        dime: numPlays >= 10,
        nickel: numPlays >= 5
      })}
    >
      <td className="rank">{rank + 1}</td>
      <td className="name">
        <a
          target="_blank"
          href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}
        >
          {game.name}
        </a>
      </td>
      <td>
        <PlayCount plays={numPlays!} />
      </td>
      <td className="duration">
        ≈{numeral(game.duration! / 60).format("0,0")}
      </td>
    </tr>
  );
};

class PlayCount extends React.Component<{ plays: number }, {}> {
  render() {
    if (this.props.plays > 0) {
      return (
        <span>
          <span className="is-hidden-mobile">Played </span>
          <b>{this.props.plays}</b> time{this.props.plays > 1 ? "s" : ""}
        </span>
      );
    } else {
      return <span>—</span>;
    }
  }
}
