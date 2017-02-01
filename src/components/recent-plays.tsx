import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { PlayStore, Play, Player, PlayedGame } from '../stores/plays-store';
import * as _ from 'lodash';

@inject("playStore")
@observer
export default class RecentPlays extends React.Component<{ playStore?: PlayStore }, {}> {
    render() {
        if (this.props.playStore.isLoading) {
            return <div></div>;
        }
        return (
            <div className="subsection">
                <div className="title is-4">
                    Recent Plays
                    <a className="title-link" href="https://boardgamegeek.com/plays/bydate/user/ervwalter/subtype/boardgame"><i className="fa fa-external-link" aria-hidden="true"></i></a>
                </div>
                <GameThumbnails games={this.props.playStore.recentGames} />
                <PlaysTable plays={_.take(this.props.playStore.plays, 15)} />
            </div>
        )
    }
};

class GameThumbnails extends React.Component<{ games: PlayedGame[] }, undefined> {
    render() {
        return (
            <div className="thumbnail-list is-hidden-mobile">
                {this.props.games.map((game) => <a href={`https://boardgamegeek.com/boardgame/${game.gameId}/`} key={game.gameId} className="fade-in" ><img src={game.thumbnail} /></a>)}
            </div>
        )
    }
}

class PlaysTable extends React.Component<{ plays: Play[] }, undefined> {
    render() {
        return (
            <div className="recent-plays">
                <table className="table is-striped is-hidden-mobile">
                    <thead><tr>
                        <th>Date</th>
                        <th>Game</th>
                        <th>Players</th>
                        <th>Location</th>
                    </tr></thead>
                    <tbody>
                        {this.props.plays.map(play => {
                            return (
                                <tr key={play.playId}>
                                    <td><span className="is-hidden-touch">{play.playDate.format("ddd")}, </span>{play.playDate.format("MMM D")}</td>
                                    <td className="name"><a href={`https://boardgamegeek.com/boardgame/${play.gameId}/`}>{play.name}</a></td>
                                    <td><Players players={play.players} /></td>
                                    <td>{play.location}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="is-hidden-tablet plays-list">
                        {this.props.plays.map(play => {
                            return (
                                <div key={play.playId} className="play">
                                    <div className="columns is-mobile is-gapless">
                                        <div className="column">
                                            <div><a href={`https://boardgamegeek.com/boardgame/${play.gameId}/`}>{play.name}</a></div>
                                        </div>
                                        <div className="column is-narrow">
                                            {play.playDate.format("MMM D")}
                                        </div>
                                    </div>
                                    <div className="play-details"><Players players={play.players} /> - <span className="location">@{play.location}</span></div>
                                </div>
                            )
                        })}
                </div>
            </div>
        )
    }
}

class Players extends React.Component<{ players: Player[] }, undefined> {
    render() {
        let players = _.sortBy(this.props.players, "name");
        let anonymousCount = _.remove(players, p => p.name.toLowerCase() == "anonymous player").length;
        let others = anonymousCount > 0 ? <span key="anonymous player">, and {anonymousCount} other{anonymousCount > 1 ? 's' : ''}</span> : "";
        return (
            <div className="players">
                {players.map((player, index) => {
                    let className = player.win ? "winner " : "";
                    let comma = (index > 0 ? ", " : "");
//                    let newPlayer = player.new ? <i className="new-player fa fa-bolt" aria-hidden="true" title="New Player"></i> : ""
                    let newPlayer = player.new ? <img src="/images/new-player.png" alt="New Player" title="New Player"/> : ""
                    return (
                        <span key={player.name}>{comma}<span className={className}>{player.name}{newPlayer}</span></span>
                    );
                })}
                {others}
            </div>
        )
    }
}

