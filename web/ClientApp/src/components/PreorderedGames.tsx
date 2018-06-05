import { inject, observer } from "mobx-react";
import * as React from "react";
import GameListOrThumbnails from "~/components/GameList";
import { CollectionStore } from "~/stores/CollectionStore";

@inject("collectionStore")
@observer
export default class PreorderedGames extends React.Component<
  { collectionStore?: CollectionStore; visible: boolean },
  {}
> {
  render() {
    if (this.props.collectionStore!.preorderedGames.length === 0) {
      return null;
    }
    let className = "subsection";
    if (!this.props.visible) {
      className += " hidden";
    }
    return (
      <div className={className}>
        <div className="title is-4">
          Preordered Games<span className="is-hidden-mobile">
            {" "}
            and Expansions
          </span>
        </div>
        <GameListOrThumbnails
          games={this.props.collectionStore!.preorderedGames}
        />
      </div>
    );
  }
}
