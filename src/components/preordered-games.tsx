import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { CollectionStore } from '../stores/collection-store';
import GameListOrThumbnails from './game-list';

@inject("collectionStore")
@observer
export default class PreorderedGames extends React.Component<{ collectionStore?: CollectionStore }, {}> {
    render() {
        if (this.props.collectionStore.preorderedGames.length == 0) {
            return null;
        }
        return (
            <div className="subsection">
                <div className="title is-4">Preordered Games<span className="is-hidden-mobile"> and Expansions</span></div>
                <GameListOrThumbnails games={this.props.collectionStore.preorderedGames} />
            </div>
        )
    }
};

