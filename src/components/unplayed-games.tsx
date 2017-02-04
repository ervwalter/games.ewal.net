import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { CollectionStore, Game } from '../stores/collection-store';
import { UIStateStore } from '../stores/ui-state-store';

@inject("collectionStore", "uiStateStore")
@observer
export default class UnplayedGames extends React.Component<{ collectionStore?: CollectionStore, uiStateStore?: UIStateStore }, {}> {
    render() {
        if (this.props.collectionStore.unplayedGames.length == 0 || this.props.uiStateStore.isMobile) {
            return null;
        }
        return (
            <div className="subsection">
                <div className="title is-4 is-hidden-mobile">
                    Unplayed and Waiting for Love
                    </div>
                <UnplayedThumbnails games={this.props.collectionStore.unplayedGames} />
            </div>
        )
    }
};

class UnplayedThumbnails extends React.Component<{ games: Game[] }, {}> {
    render() {
        return (
            <div className="thumbnail-list full-height is-hidden-mobile">
                {this.props.games.map((game) => <a href={`https://boardgamegeek.com/boardgame/${game.gameId}/`} target="_blank" key={game.gameId}><img src={game.thumbnail} alt={game.name} title={game.name} /></a>)}
            </div>
        )
    }
}


