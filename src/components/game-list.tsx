import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { Game } from '../stores/collection-store';
import { UIStateStore } from '../stores/ui-state-store';

@inject("uiStateStore")
@observer
export default class GameListOrThumbnails extends React.Component<{ games: Game[], uiStateStore?: UIStateStore }, {}> {
    render() {
        if (this.props.uiStateStore.isMobile) {
            return (
                <div className="content">
                <ul className="game-list">
                    {this.props.games.map((game) => <li key={game.gameId}><a href={`https://boardgamegeek.com/boardgame/${game.gameId}/`} target="_blank">{game.name}</a></li>)}
                </ul>
                </div>
            );
        } else {
            return (
                <div className="thumbnail-list full-height">
                    {this.props.games.map((game) => <a href={`https://boardgamegeek.com/boardgame/${game.gameId}/`} target="_blank" key={game.gameId}><img src={game.thumbnail} alt={game.name} title={game.name} /></a>)}
                </div>
            );
        }
    }
}


