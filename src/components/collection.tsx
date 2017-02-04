import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { CollectionStore, SortColumns, Game } from '../stores/collection-store';
import { UIStateStore } from '../stores/ui-state-store';
import * as _ from 'lodash';

@inject("collectionStore")
@observer
export default class RecentPlays extends React.Component<{ collectionStore?: CollectionStore }, {}> {
    handleSort = (column: SortColumns, e: any) => {
        console.log(column);
        e.preventDefault();
        this.props.collectionStore.changeSort(column);
    }

    render() {
        return (
            <div className="subsection">
                {this.props.collectionStore.unplayedGames.length > 0 && [
                    <div className="title is-4 is-hidden-mobile" key="title">
                        Unplayed and Waiting for Love
                    </div>,
                    <UnplayedThumbnails games={this.props.collectionStore.unplayedGames} key="unplayed" />
                ]}
                <div className="title is-4">
                    <span className="is-hidden-mobile">Current </span>Game Collection
                        <a className="title-link" target="_blank" href="https://boardgamegeek.com/collection/user/ervwalter?own=1"><i className="fa fa-external-link" aria-hidden="true"></i></a>
                </div>
                <div className="collection">
                    <table className="table is-striped">
                        <thead><tr>
                            <th><a onClick={(e) => this.handleSort('sortableName', e)}>Name</a></th>
                            <th><a onClick={(e) => this.handleSort('numPlays', e)}><span className="is-hidden-mobile">Times </span>Played</a></th>
                            <th className="rating"><a onClick={(e) => this.handleSort('rating', e)}><span className="is-hidden-mobile">My </span>Rating</a></th>
                        </tr></thead>
                        <tbody>
                            {this.props.collectionStore.sortedGames.map(game => <CollectionRow game={game} key={game.gameId} />)}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
};

class UnplayedThumbnails extends React.Component<{ games: Game[] }, undefined> {
    render() {
        return (
            <div className="thumbnail-list full-height is-hidden-mobile">
                {this.props.games.map((game) => <a href={`https://boardgamegeek.com/boardgame/${game.gameId}/`} target="_blank" key={game.gameId}><img src={game.thumbnail} /></a>)}
            </div>
        )
    }
}

class CollectionRow extends React.Component<{ game: Game }, undefined> {
    render() {
        let game = this.props.game;
        return (
            <tr>
                <td className="name">
                    <a target="_blank" href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}>{game.name}</a>
                    {game.ownedExpansionCount > 0 &&
                        <Expansions game={game} />
                    }
                </td>
                <td><PlayCount plays={game.numPlays} /></td>
                <td className="rating"><Rating value={game.rating} /></td>
            </tr>
        )
    }
}

class Expansions extends React.Component<{ game: Game }, undefined> {
    render() {
        let game = this.props.game;
        let maxIndex = game.expansions.length - 1;
        return (
            <div className="expansions">
                <span className="expansion-count">{game.ownedExpansionCount} expansions</span>
                <div className="box expansions-tip">
                    {_.sortBy(game.expansions, 'sortableName').map((expansion, index) => {
                        return <div key={expansion.gameId}>{expansion.name}{index < maxIndex ? ',' : ''}</div>;
                    })}
                </div>
            </div>
        );
    }
}

class PlayCount extends React.Component<{ plays: number }, undefined> {
    render() {
        if (this.props.plays > 0) {
            return (
                <span>
                    <span className="is-hidden-mobile">Played </span><b>{this.props.plays}</b> time{this.props.plays > 1 ? 's' : ''}
                </span>
            );
        }
        else {
            return <span>—</span>;
        }
    }
}

@inject("uiStateStore")
@observer
class Rating extends React.Component<{ value: number, uiStateStore?: UIStateStore }, undefined> {
    render() {
        if (this.props.value > 0) {
            return (
                <span>
                    {this.props.uiStateStore.isMobile ? (
                        <span>{this.props.value}</span>
                    ) : (
                            <span className="stars-container">
                                <span className="stars-background is-flex">
                                    <i className="fa fa-star-o" aria-hidden="true"></i>
                                    <i className="fa fa-star-o" aria-hidden="true"></i>
                                    <i className="fa fa-star-o" aria-hidden="true"></i>
                                    <i className="fa fa-star-o" aria-hidden="true"></i>
                                    <i className="fa fa-star-o" aria-hidden="true"></i>
                                    <i className="fa fa-star-o" aria-hidden="true"></i>
                                    <i className="fa fa-star-o" aria-hidden="true"></i>
                                    <i className="fa fa-star-o" aria-hidden="true"></i>
                                    <i className="fa fa-star-o" aria-hidden="true"></i>
                                    <i className="fa fa-star-o" aria-hidden="true"></i>
                                </span>
                                <span className="stars-foreground is-flex" style={{ width: `${this.props.value * 10}%` }}>
                                    <i className="fa fa-star" aria-hidden="true"></i>
                                    <i className="fa fa-star" aria-hidden="true"></i>
                                    <i className="fa fa-star" aria-hidden="true"></i>
                                    <i className="fa fa-star" aria-hidden="true"></i>
                                    <i className="fa fa-star" aria-hidden="true"></i>
                                    <i className="fa fa-star" aria-hidden="true"></i>
                                    <i className="fa fa-star" aria-hidden="true"></i>
                                    <i className="fa fa-star" aria-hidden="true"></i>
                                    <i className="fa fa-star" aria-hidden="true"></i>
                                    <i className="fa fa-star" aria-hidden="true"></i>
                                </span>
                            </span>
                        )}
                </span>
            );
        }
        else {
            return <span>—</span>;
        }
    }
}

