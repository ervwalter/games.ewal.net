import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { CollectionStore } from '../stores/collection-store';
import GameListOrThumbnails from './game-list';

@inject("collectionStore")
@observer
export default class PreorderedGames extends React.Component<{ collectionStore?: CollectionStore, visible: boolean }, {}> {
    render() {
        if (this.props.collectionStore.preorderedGames.length == 0) {
            return null;
        }
        let className = "subsection";
        if (!this.props.visible) {
            className += " hidden";
        }
        return (
            <div className={className}>
                <div className="title is-4">Preordered Games<span className="is-hidden-mobile"> and Expansions</span></div>
                <GameListOrThumbnails games={this.props.collectionStore.preorderedGames} />
            </div>
        )
    }
};

