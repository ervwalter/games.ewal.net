import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { CollectionStore, SortColumns, Game } from '../stores/collection-store';
import { UIStateStore } from '../stores/ui-state-store';
import * as _ from 'lodash';

@inject("collectionStore")
@observer
export default class Collection extends React.Component<{ collectionStore?: CollectionStore, visible: boolean  }, {}> {
    handleSort = (column: SortColumns, e: any) => {
        e.preventDefault();
        this.props.collectionStore.changeSort(column);
    };

    render() {
        if (this.props.collectionStore.games.length == 0) {
            return null;
        }
        let className = "subsection";
        if (!this.props.visible) {
            className += " hidden";
        }
        return (
            <div className={className}>
                <div className="title is-4">
                    <span className="is-hidden-mobile">Current </span>Game Collection
                        <a className="title-link" target="_blank" href="https://boardgamegeek.com/collection/user/ervwalter?own=1"><i className="fa fa-external-link" aria-hidden="true"></i></a>
                </div>
                <CollectionTable games={this.props.collectionStore.sortedGames} handleSort={this.handleSort}/>
            </div>
        )
    }
};

class CollectionTable extends React.Component<{ games: Game[], handleSort: (column: SortColumns, e: any) => void}, {}> {
    render() {
        return (
            <div className="collection">
                <table className="table is-striped">
                    <thead><tr>
                        <th><a onClick={(e) => this.props.handleSort('sortableName', e)}>Name</a></th>
                        <th><a onClick={(e) => this.props.handleSort('numPlays', e)}><span className="is-hidden-mobile">Times </span>Played</a></th>
                        <th className="rating"><a onClick={(e) => this.props.handleSort('rating', e)}><span className="is-hidden-mobile">My </span>Rating</a></th>
                    </tr></thead>
                    <tbody>
                        {this.props.games.map(game => <CollectionRow game={game} key={game.gameId} />)}
                    </tbody>
                </table>
            </div>
        );
    }
}

class CollectionRow extends React.Component<{ game: Game }, {}> {
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
                <td className="rating"><Rating rating={game.rating} /></td>
            </tr>
        )
    }
}

class Expansions extends React.Component<{ game: Game }, {}> {
    render() {
        let game = this.props.game;
        let maxIndex = game.expansions.length - 1;
        return (
            <div className="expansions">
                <span className="expansion-count">{game.ownedExpansionCount} expansions</span>
                <div className="box expansions-tip">
                    {_.sortBy(game.expansions, 'sortableShortName').map((expansion, index) => {
                        return <div key={expansion.gameId}>{expansion.shortName}{index < maxIndex ? ',' : ''}</div>;
                    })}
                </div>
            </div>
        );
    }
}

class PlayCount extends React.Component<{ plays: number }, {}> {
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
class Rating extends React.Component<{ rating: number, uiStateStore?: UIStateStore }, {}> {
    render() {
        if (this.props.rating > 0) {
            if (this.props.uiStateStore.isMobile) {
                return <RatingNumber rating={this.props.rating} />;
            }
            else {
                return <RatingStars rating={this.props.rating} />;
            }
        }
        else {
            return <span>—</span>;
        }
    }
}

class RatingNumber extends React.Component<{ rating: number }, {}> {
    render() {
        return <span>{this.props.rating}</span>
    }
}


class RatingStars extends React.Component<{ rating: number }, {}> {
    render() {
        return (
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
                <span className="stars-foreground is-flex" style={{ width: `${this.props.rating * 10}%` }}>
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
        )
    }
}
