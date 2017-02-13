import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { CollectionStore } from '../stores/collection-store';
import GameListOrThumbnails from './game-list';

@inject("collectionStore")
@observer
export default class UnplayedGames extends React.Component<{ collectionStore?: CollectionStore }, {}> {
    render() {
        if (this.props.collectionStore.unplayedGames.length == 0) {
            return null;
        }
        return (
            <div className="subsection">
                <div className="title is-4">
                    <span className="is-hidden-mobile">Patiently </span>Waiting to be Played
                    </div>
                <GameListOrThumbnails games={this.props.collectionStore.unplayedGames} />
            </div>
        )
    }
};

