import { inject, observer } from "mobx-react";
import * as React from "react";
import { Game } from "~/stores/CollectionStore";
import { ViewStateStore } from "~/stores/ViewStateStore";

@inject("viewStateStore")
@observer
export default class GameListOrThumbnails extends React.Component<
  { games: Game[]; viewStateStore?: ViewStateStore },
  {}
> {
  render() {
    if (this.props.viewStateStore!.isMobile) {
      return (
        <div className="content">
          <ul className="game-list">
            {this.props.games.map(game => (
              <li key={game.gameId}>
                <a
                  href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}
                  target="_blank"
                >
                  {game.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return (
        <div className="thumbnail-list full-height">
          {this.props.games.map(game => (
            <a
              href={`https://boardgamegeek.com/boardgame/${game.gameId}/`}
              target="_blank"
              key={game.gameId}
            >
              <img src={game.thumbnail} alt={game.name} title={game.name} />
            </a>
          ))}
        </div>
      );
    }
  }
}
